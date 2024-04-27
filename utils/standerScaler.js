class StandardScaler {
    constructor() {}

    async scale(data) {
        const means = await this.calculateMeans(data);
        const stdDevs = await this.calculateStdDevs(data, means);

        return data.map(row => row.map((item, index) => (item - means[index]) / stdDevs[index]));
    }

    calculateMeans(data) {
        return new Promise(resolve => {
            let means = data[0].map((_, colIndex) => data.reduce((sum, row) => sum + row[colIndex], 0) / data.length);
            resolve(means);
        });
    }

    calculateStdDevs(data, means) {
        return new Promise(resolve => {
            let stdDevs = data[0].map((_, colIndex) => {
                return Math.sqrt(data.reduce((acc, row) => acc + ((row[colIndex] - means[colIndex]) ** 2), 0) / data.length);
            });
            resolve(stdDevs);
        });
    }
}

module.exports = StandardScaler;