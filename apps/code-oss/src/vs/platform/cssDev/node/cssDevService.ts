/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { spawn } from 'child_process';
import { relative } from '../../../base/common/path.js';
import { FileAccess } from '../../../base/common/network.js';
import { StopWatch } from '../../../base/common/stopwatch.js';
import { Promises as pfs } from '../../../base/node/pfs.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { ILogService } from '../../log/common/log.js';

export const ICSSDevelopmentService = createDecorator<ICSSDevelopmentService>('ICSSDevelopmentService');

export interface ICSSDevelopmentService {
	_serviceBrand: undefined;
	isEnabled: boolean;
	getCssModules(): Promise<string[]>;
}

export class CSSDevelopmentService implements ICSSDevelopmentService {

	declare _serviceBrand: undefined;

	private _cssModules?: Promise<string[]>;

	constructor(
		@IEnvironmentService private readonly envService: IEnvironmentService,
		@ILogService private readonly logService: ILogService
	) { }

	get isEnabled(): boolean {
		return !this.envService.isBuilt;
	}

	getCssModules(): Promise<string[]> {
		this._cssModules ??= this.computeCssModules();
		return this._cssModules;
	}

	private async computeCssModules(): Promise<string[]> {
		if (!this.isEnabled) {
			return [];
		}

		const sw = StopWatch.create();
		const basePath = FileAccess.asFileUri('').fsPath;

		let result = await this.computeCssModulesWithRipgrep(basePath);
		if (result.length === 0) {
			result = await this.computeCssModulesWithFsWalk(basePath);
		}

		if (result.some(path => path.indexOf('vs/') !== 0)) {
			this.logService.error(`[CSS_DEV] Detected invalid paths in css modules: ${result.join(', ')}`);
		}

		this.logService.info(`[CSS_DEV] DONE, ${result.length} css modules (${Math.round(sw.elapsed())}ms)`);
		return result;
	}

	private async computeCssModulesWithRipgrep(basePath: string): Promise<string[]> {
		try {
			const rg = await import('@vscode/ripgrep');
			return await new Promise<string[]>((resolve) => {
				const chunks: Buffer[] = [];
				const process = spawn(rg.rgPath, ['-g', '**/*.css', '--files', '--no-ignore', basePath], {});

				process.stdout.on('data', data => {
					chunks.push(data);
				});
				process.on('error', err => {
					this.logService.error('[CSS_DEV] FAILED to compute CSS data with ripgrep', err);
					resolve([]);
				});
				process.on('close', () => {
					const data = Buffer.concat(chunks).toString('utf8');
					resolve(data.split('\n').filter(Boolean).map(path => relative(basePath, path).replace(/\\/g, '/')).filter(Boolean).sort());
				});
			});
		} catch (error) {
			this.logService.error('[CSS_DEV] FAILED to load ripgrep for CSS data', error);
			return [];
		}
	}

	private async computeCssModulesWithFsWalk(basePath: string): Promise<string[]> {
		this.logService.info('[CSS_DEV] Falling back to filesystem walk for CSS data');

		const result: string[] = [];
		const walk = async (folderPath: string): Promise<void> => {
			const entries = await pfs.readdir(folderPath, { withFileTypes: true });

			await Promise.all(entries.map(async entry => {
				const entryPath = `${folderPath}/${entry.name}`.replace(/\//g, '\\');

				if (entry.isDirectory()) {
					await walk(entryPath);
					return;
				}

				if (entry.isFile() && entry.name.endsWith('.css')) {
					result.push(relative(basePath, entryPath).replace(/\\/g, '/'));
				}
			}));
		};

		try {
			await walk(basePath);
		} catch (error) {
			this.logService.error('[CSS_DEV] FAILED to compute CSS data with filesystem walk', error);
			return [];
		}

		return result.sort();
	}
}
