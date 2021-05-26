import path from "path";

/**
 * Ensures that the given path follows posix file names
 */
export function ensurePosix(p: string): string {
	const isExtendedLengthPath = /^\\\\\?\\/.test(p);
	// eslint-disable-next-line no-control-regex
	const hasNonAscii = /[^\u0000-\u0080]+/.test(p);

	if (isExtendedLengthPath || hasNonAscii) {
		return p;
	}

	return p.replace(/\\/g, "/");
}

/**
 * Wraps all the given method names with a call to ensurePosix
 */
function ensurePosixReturnValues<MethodName extends keyof path.PlatformPath>(methodNames: MethodName[]): {[Key in MethodName]: path.PlatformPath[Key]} {
	const obj = {} as {[Key in MethodName]: path.PlatformPath[Key]};
	for (const methodName of methodNames) {
		Object.assign(obj, {
			[methodName]() {
				// eslint-disable-next-line prefer-rest-params
				const looksLikeWindowsPaths = [...arguments].some(argument => typeof argument === "string" && looksLikeWindowsPath(argument));

				// eslint-disable-next-line prefer-rest-params
				return ensurePosix(((looksLikeWindowsPaths ? path.win32[methodName] : path[methodName]) as CallableFunction)(...arguments));
			}
		});
	}
	return obj;
}

/**
 * Wraps all arguments in a call to ensurePosix before being passed back to their respective posix methods
 */
function ensurePosixArguments<MethodName extends keyof path.PlatformPath>(methodNames: MethodName[]): {[Key in MethodName]: path.PlatformPath[Key]} {
	const obj = {} as {[Key in MethodName]: path.PlatformPath[Key]};
	for (const methodName of methodNames) {
		Object.assign(obj, {
			[methodName]() {
				// eslint-disable-next-line prefer-rest-params
				return (path.posix[methodName] as CallableFunction)(...[...arguments].map(argument => (typeof argument === "string" ? ensurePosix(argument) : argument)));
			}
		});
	}
	return obj;
}

/**
 * Returns true if the given path looks like a Windows path
 */
function looksLikeWindowsPath(p: string): boolean {
	return /\\/.test(p);
}

const posixBase = {
	...path.posix,
	...ensurePosixArguments(["parse", "isAbsolute"]),
	...ensurePosixReturnValues(["join", "normalize", "relative", "resolve", "dirname", "basename", "extname", "format", "toNamespacedPath"])
};

export const posix: path.PlatformPath = {
	...posixBase,
	get posix() {
		return this;
	},

	get win32() {
		return win32;
	}
};

export const win32: path.PlatformPath = {
	...path.win32,
	get posix() {
		return posix;
	},
	get win32() {
		return this;
	}
};

export default {
	...posixBase,
	posix,
	win32,
	native: path
};
