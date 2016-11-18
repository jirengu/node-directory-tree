
var FS = require('fs');
var PATH = require('path');

function directoryTree (path, extensions) {
	var name = PATH.basename(path);
	var item = { path, name };
	var stats;

	try { stats = FS.statSync(path); }
	catch (e) { return null; }

	if (stats.isFile()) {
		var ext = PATH.extname(path).toLowerCase();
		if (extensions && extensions.length && extensions.indexOf(ext) === -1) return null;
		item.size = stats.size;  // File size in bytes
		item.extension = ext;
	}
	else if (stats.isDirectory()) {
		try {
			item.children = FS.readdirSync(path)
				.map(child => directoryTree(PATH.join(path, child), extensions))
				.filter(e => !!e);
			item.size = item.children.reduce((prev, cur) => prev + cur.size, 0);
		} catch(ex) {
			if (ex.code == "EACCES")
				//User does not have permissions, ignore directory
				return null;
		}
	} else {
		return null; // Or set item.size = 0 for devices, FIFO and sockets ?
	}
	return item;
}

module.exports = directoryTree;
