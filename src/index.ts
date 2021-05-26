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
 * Solve the relative path from {from} to {to}. At times we have two absolute paths,
 * and we need to derive the relative path from one to the other.
 * This is actually the reverse transform of path.resolve.
 */
export function relative(from: string, to: string): string {
	return ensurePosix(nativeRelative(from, to));
}

/**
 * Join all arguments together and normalize the resulting path.
 * Arguments must be strings. In v0.8, non-string arguments were silently ignored.
 * In v0.10 and up, an exception is thrown.
 * @param paths
 */
export function join(...paths: string[]): string {
	return ensurePosix(path.join(...paths));
}

/**
 * POSIX-normalizes a string path, reducing '..' and '.' parts.
 * When multiple slashes are found, they're replaced by a single one; when the path contains a trailing slash, it is preserved.
 * When a win32-formatted path is seen, backslashes are converted to forward-slashes.
 */
export function normalize(p: string): string {
	return ensurePosix(p);
}

/**
 * The right-most parameter is considered {to}. Other parameters are considered an array of {from}.
 * Starting from leftmost {from} parameter, resolves {to} to an absolute path.
 * If {to} isn't already absolute, {from} arguments are prepended in right to left order,
 * until an absolute path is found. If after using all {from} paths still no absolute path is found,
 * the current working directory is used as well. The resulting path is normalized, and
 * trailing slashes are removed unless the path gets resolved to the root directory.
 */
export function resolve(p: string): string {
	return ensurePosix(path.resolve(p));
}

/**
 * Return the directory name of a path. Similar to the Unix dirname command
 */
export function dirname(p: string): string {
	return ensurePosix(path.dirname(p));
}

/**
 * Return the last portion of a path. Similar to the Unix basename command.
 * Often used to extract the file name from a fully qualified path.
 */
export function basename(p: string): string {
	return ensurePosix(path.basename(p));
}

/**
 * Return the extension of the path, from the last '.' to end of string in the last portion of the path.
 * If there is no '.' in the last portion of the path or the first character of it is '.',
 * then it returns an empty string
 */
export function extname(p: string): string {
	return path.extname(p);
}

/**
 * Returns an object from a path string - the opposite of format()
 */
export function parse(p: string): path.ParsedPath {
	const parsedPath = path.parse(p);
	return {
		ext: parsedPath.ext,
		name: normalize(parsedPath.name),
		base: normalize(parsedPath.base),
		dir: normalize(parsedPath.dir),
		root: normalize(parsedPath.root)
	};
}

/**
 * Returns a path string from an object - the opposite of parse()
 */
export function format(p: path.ParsedPath): string {
	const normalized: path.ParsedPath = {
		ext: p.ext,
		name: normalize(p.name),
		base: normalize(p.base),
		dir: normalize(p.dir),
		root: normalize(p.root)
	};
	return path.posix.format(normalized);
}

/**
 * Determines whether {path} is an absolute path. An absolute path will
 * always resolve to the same location, regardless of the working directory
 */
export function isAbsolute(p: string): boolean {
	return path.posix.isAbsolute(normalize(p));
}

/**
 * A noop since toNamespacedPath is non-operational on POSIX and always returns path without modifications
 */
export function toNamespacedPath(p: string): string {
	return p;
}

/**
 * The POSIX-normalized file delimiter, ':'
 */
export const delimiter = path.posix.delimiter;

/**
 * The POSIX-normalized file separator, '/'
 */
export const sep = path.posix.sep;

/**
 * A proxy for the equivalent method on the path object
 */
export function nativeIsAbsolute(p: string): boolean {
	return path.isAbsolute(nativeNormalize(p));
}

/**
 * A proxy for the equivalent method on the path object
 */
export function nativeNormalize(p: string): string {
	// Converts to either POSIX or native Windows file paths
	return path.normalize(p);
}

/**
 * A proxy for the equivalent method on the path object
 */
export function nativeDirname(p: string): string {
	return path.dirname(p);
}

/**
 * A proxy for the equivalent method on the path object
 */
export function nativeJoin(...paths: string[]): string {
	return path.join(...paths);
}

/**
 * A proxy for the equivalent method on the path object
 */
export function nativeParse(p: string): path.ParsedPath {
	return path.parse(nativeNormalize(p));
}

/**
 * A proxy for the equivalent method on the path object
 */
export function nativeFormat(p: path.ParsedPath): string {
	return nativeNormalize(path.format(p));
}

/**
 * A proxy for the equivalent method on the path object
 */
export function nativeResolve(p: string): string {
	return nativeNormalize(path.resolve(p));
}

/**
 * A proxy for the equivalent method on the path object
 */
export function nativeBasename(p: string): string {
	return nativeNormalize(path.basename(p));
}

/**
 * A proxy for the equivalent method on the path object
 */
export function nativeExtname(p: string): string {
	return path.extname(p);
}

/**
 * A proxy for the equivalent method on the path object
 */
export function nativeRelative(from: string, to: string): string {
	return path.relative(from, to);
}

/**
 * A proxy for the equivalent method on the path object
 */
export function nativeToNamespacedPath(p: string): string {
	return path.toNamespacedPath(p);
}

/**
 * A proxy for the equivalent constant on the path object
 */
export const nativeSep = path.sep;

/**
 * A proxy for the equivalent constant on the path object
 */
export const nativeDelimiter = path.delimiter;

const posixBase = {
	delimiter,
	sep,
	isAbsolute,
	join,
	normalize,
	relative,
	resolve,
	dirname,
	basename,
	extname,
	parse,
	format,
	toNamespacedPath
};

const nativeBase = {
	nativeDelimiter,
	nativeSep,
	nativeIsAbsolute,
	nativeJoin,
	nativeNormalize,
	nativeRelative,
	nativeResolve,
	nativeDirname,
	nativeBasename,
	nativeExtname,
	nativeParse,
	nativeFormat,
	nativeToNamespacedPath
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
	...nativeBase,
	posix,
	win32
};
