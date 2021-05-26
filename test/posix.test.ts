import test from "ava";
import path from "../src/index";

test("Dotting through the 'posix' recursive self-references will still point to the shimmed methods. #1", async t => {
	t.deepEqual(path.posix.posix.posix, path.posix);
});

test("Correctly converts a win32-formatted string to POSIX. #1", async t => {
	t.deepEqual(path.normalize("C:\\Users\\foo\\bar.js"), `C:/Users/foo/bar.js`);
});

test("Parsing a win32-formatted string generates POSIX-formatted parts. #1", async t => {
	t.deepEqual(path.parse("C:\\Users\\foo\\bar.js"), {
		base: "C:/Users/foo/bar.js",
		dir: "",
		ext: ".js",
		name: "C:/Users/foo/bar",
		root: ""
	});
});
