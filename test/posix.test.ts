import test from "ava";
import * as path from "../src/index";

test("Dotting through the 'posix' recursive self-references will still point to the shimmed methods. #1", async t => {
	t.deepEqual(path.posix.posix.posix, path.posix);
});

test("Correctly converts a win32-formatted string to POSIX. #1", async t => {
	t.deepEqual(path.normalize("C:\\Users\\foo\\bar.js"), `C:/Users/foo/bar.js`);
});

test("Parsing a win32-formatted string generates POSIX-formatted parts. #1", async t => {
	t.deepEqual(path.parse("C:\\Users\\foo\\bar.js"), {
		root: "",
		dir: "C:/Users/foo",
		base: "bar.js",
		ext: ".js",
		name: "bar"
	});
});

test("Formatting a win32-formatted ParsedPath generates a POSIX-formatted string. #1", async t => {
	t.deepEqual(
		path.format({
			root: "",
			dir: "C:\\Users\\foo",
			base: "bar.js",
			ext: ".js",
			name: "bar"
		}),
		"C:/Users/foo/bar.js"
	);
});

test("Normalizing './foo' still yields './foo'. #1", async t => {
	t.deepEqual(path.normalize("./foo"), "./foo");
});

test("Testing for absolute paths works, including on an POSIX-formatted windows path. #1", async t => {
	t.true(path.isAbsolute(`D:/a/b/c/#d`));
});

test("Testing for absolute paths works, including on an POSIX-formatted windows path. #2", async t => {
	t.true(path.isAbsolute(`D:\\a\\b\\c\\#d`));
});
