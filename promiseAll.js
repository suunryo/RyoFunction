function promiseAll(args) {
    if (!args) {
        return undefined;
    }
    if (!args[Symbol.iterator] || typeof args[Symbol.iterator] !== "function" ) {
        return args;
    }

    return new Promise(function(resolve, reject) {
        const _results = {};
        let forIndex = 0;
        let doneIndex = 0;

        for (const item of args) {
            let index = forIndex;
            forIndex += 1;

            Promise.resolve(item).then(function(res) {
                doneIndex += 1;
                _results[index] = res;
                if (forIndex === doneIndex) {
                    _results.length = doneIndex;
                    resolve(Array.from(_results));
                }
            }).catch((err) => {
                reject(err);
            })
        }

        if (forIndex === 0) {
            resolve([]);
        }
    })
}
