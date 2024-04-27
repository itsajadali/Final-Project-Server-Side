const createTimeSeriesDataset = async (
  feature,
  sequenceLength,
  stride,
  numWindows
) => {
  let x = new Array(numWindows);

  let startW = 0;

  for (let winI = 0; winI < numWindows; winI++) {
    x[winI] = new Array(sequenceLength);

    for (let seq = 0; seq < sequenceLength; seq++) {
      x[winI][seq] = feature[startW + seq].slice(); // Copies the feature row
    }
    startW += stride;
  }

  return x;
};

const Datasets = async (data, sequenceLength, stride) => {
  let datasets = [];
  for (let i = 0; i < data.length; i++) {
    const numWindows = Math.floor(data[i].features.length / sequenceLength);
    const dataset = await createTimeSeriesDataset(
      data[i].features,
      sequenceLength,
      stride,
      numWindows
    );
    datasets.push(dataset);
  }
  return datasets;
};
module.exports = Datasets;
