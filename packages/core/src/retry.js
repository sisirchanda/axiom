async function retry(fn, retries = 3, delay = 2000) {

    for (let i = 1; i <= retries; i++) {
        try {
            return await fn();
        } catch (error) {

            if (i === retries) {
                throw error;
            }

            console.log(`Retry attempt ${i} failed`);

            await new Promise(r => setTimeout(r, delay));
        }
    }
}

module.exports = retry;