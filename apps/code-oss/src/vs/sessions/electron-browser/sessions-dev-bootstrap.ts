(function () {

	type ISandboxConfiguration = import('../../base/parts/sandbox/common/sandboxTypes.js').ISandboxConfiguration;
	type IMainWindowSandboxGlobals = import('../../base/parts/sandbox/electron-browser/globals.js').IMainWindowSandboxGlobals;

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
			throw new Error('Unable to resolve sandbox configuration for sessions bootstrap.');
		}

		const baseUrl = new URL(`${fileUriFromPath(configuration.appRoot, { isWindows: preloadGlobals?.process.platform === 'win32', scheme: 'vscode-file', fallbackAuthority: 'vscode-app' })}/out/`);
		globalThis._VSCODE_FILE_ROOT = baseUrl.toString();

		setupCSSImportMaps(configuration, baseUrl);

		const script = document.createElement('script');
		script.type = 'module';
		script.src = './sessions.js';
		window.document.documentElement.appendChild(script);
	})().catch(error => console.error('[sessions-dev-bootstrap]', error));
}());
