const fs = require("fs");
const root = "./";
const tempDirectoryName = "_temp";
const doesNotExistErrorCode = "ENOENT";

const dump = (path) => {
	return new Promise((resolve, reject) => {
		console.log(`dump("${path}")`);

		fs.rm(path, {
			recursive: true,
			force: true
		}, (err) => {
			if (err) {
				if (err.code === doesNotExistErrorCode) {
					// Already doesn't exist, yay!
					resolve();
					return;
				}

				if (path.includes(tempDirectoryName)) {
					// Don't attempt to rename temp directory into the temp directory
					resolve();
					return;
				}

				const tempDirName = Math.floor(+new Date * Math.random());
				fs.rename(path, `${root}${tempDirectoryName}/${tempDirName}`, (renameErr) => {
					if (renameErr && renameErr.code !== doesNotExistErrorCode) {
						reject(renameErr);
					} else {
						// Successfully renamed it into the temp directory!
						resolve();
					}
				});
			} else {
				// Successfully deleted!
				resolve();
			}
		});
	});
};

const clean = async () => {
	await dump(`${root}build`);
	await dump(`${root}_static`);
	await dump(`${root}${tempDirectoryName}`);
};

clean();
