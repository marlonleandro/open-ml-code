(function () {

	type ISandboxConfiguration = import('../../../base/parts/sandbox/common/sandboxTypes.js').ISandboxConfiguration;
	type IMainWindowSandboxGlobals = import('../../../base/parts/sandbox/electron-browser/globals.js').IMainWindowSandboxGlobals;

	const preloadGlobals = (window as unknown as { vscode?: IMainWindowSandboxGlobals }).vscode;

	function fileUriFromPath(path: string, config: { isWindows?: boolean; scheme?: string; fallbackAuthority?: string }): string {
		let pathName = path.replace(/\\/g, '/');
		if (pathName.length > 0 && pathName.charAt(0) !== '/') {
			pathName = `/${pathName}`;
		}

		let uri: string;
		if (config.isWindows && pathName.startsWith('//')) {
			uri = encodeURI(`${config.scheme || 'file'}:${pathName}`);
		} else {
			uri = encodeURI(`${config.scheme || 'file'}://${config.fallbackAuthority || ''}${pathName}`);
		}

		return uri.replace(/#/g, '%23');
	}

	function withNormalizedWindowsDrive(url: string): string[] {
		const match = /^([a-z]+:\/\/[^/]+\/)([A-Z]):(\/.*)$/i.exec(url);
		if (!match) {
			return [url];
		}

		const [, prefix, drive, suffix] = match;
		const lowerCased = `${prefix}${drive.toLowerCase()}:${suffix}`;
		return lowerCased === url ? [url] : [url, lowerCased];
	}

	function setupCSSImportMaps(configuration: ISandboxConfiguration, baseUrl: URL): void {
		if (globalThis._VSCODE_DISABLE_CSS_IMPORT_MAP) {
			return;
		}

		if (!Array.isArray(configuration.cssModules) || configuration.cssModules.length === 0) {
			console.info('[OML CSS MAP] no cssModules available');
			return;
		}

		if (document.head.querySelector('script[data-vscode-css-importmap="true"]')) {
			return;
		}

		globalThis._VSCODE_CSS_LOAD = function (url) {
			const link = document.createElement('link');
			link.setAttribute('rel', 'stylesheet');
			link.setAttribute('type', 'text/css');
			link.setAttribute('href', url);

			window.document.head.appendChild(link);
		};

		const importMap: { imports: Record<string, string> } = { imports: {} };
		for (const cssModule of configuration.cssModules) {
			const cssUrl = new URL(cssModule, baseUrl).href;
			const jsSrc = `globalThis._VSCODE_CSS_LOAD('${cssUrl}');\n`;
			const blob = new Blob([jsSrc], { type: 'application/javascript' });
			const blobUrl = URL.createObjectURL(blob);
			for (const normalizedCssUrl of withNormalizedWindowsDrive(cssUrl)) {
				importMap.imports[normalizedCssUrl] = blobUrl;
			}
		}

		const debugModules = [
			'vs/workbench/contrib/extensions/browser/media/extensionManagement.css',
			'vs/workbench/contrib/debug/browser/media/callStackEditorContribution.css',
			'vs/workbench/contrib/share/browser/share.css',
			'vs/workbench/contrib/markdown/browser/media/markdown.css',
			'vs/base/browser/ui/contextview/contextview.css',
			'vs/workbench/browser/parts/banner/media/bannerpart.css',
			'vs/workbench/browser/actions/media/actions.css',
			'vs/workbench/browser/parts/statusbar/media/statusbarpart.css',
			'vs/workbench/electron-browser/media/window.css'
		];
		console.info('[OML CSS MAP] moduleCount', configuration.cssModules.length, 'importCount', Object.keys(importMap.imports).length);
		for (const debugModule of debugModules) {
			const debugUrl = new URL(debugModule, baseUrl).href;
			const normalizedDebugUrls = withNormalizedWindowsDrive(debugUrl);
			console.info('[OML CSS MAP] entry', debugModule, normalizedDebugUrls.some(url => Boolean(importMap.imports[url])));
		}

		const ttp = window.trustedTypes?.createPolicy('vscode-bootstrapImportMapEarly', { createScript(value) { return value; } });
		const importMapSrc = JSON.stringify(importMap, undefined, 2);
		const importMapScript = document.createElement('script');
		importMapScript.type = 'importmap';
		importMapScript.setAttribute('data-vscode-css-importmap', 'true');
		// @ts-expect-error
		importMapScript.textContent = ttp?.createScript(importMapSrc) ?? importMapSrc;
		window.document.head.appendChild(importMapScript);
	}

	(async function bootstrap() {
		const configuration = await preloadGlobals?.context.resolveConfiguration();
		if (!configuration) {
			throw new Error('Unable to resolve sandbox configuration for workbench bootstrap.');
		}

		const baseUrl = new URL(`${fileUriFromPath(configuration.appRoot, { isWindows: preloadGlobals?.process.platform === 'win32', scheme: 'vscode-file', fallbackAuthority: 'vscode-app' })}/out/`);
		globalThis._VSCODE_FILE_ROOT = baseUrl.toString();

		setupCSSImportMaps(configuration, baseUrl);

		performance.mark('code/willLoadWorkbenchMain');

		const script = document.createElement('script');
		script.type = 'module';
		script.src = './workbench.js';
		window.document.documentElement.appendChild(script);
	})().catch(error => console.error('[workbench-dev-bootstrap]', error));
}());
