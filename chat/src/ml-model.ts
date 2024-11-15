import tf from '@tensorflow/tfjs-node'; // Usando a exportação padrão

export const preprocessText = (text: string): tf.Tensor => {
    const processedText = text.toLowerCase().replace(/[^\w\s]/gi, '');
    const tensorText = tf.tensor([/* Representação numérica do texto */]);
    return tensorText;
};

let model: tf.LayersModel | null = null;

const loadModel = async () => {
    if (!model) {
        model = await tf.loadLayersModel('file://path/to/saved_model/model.json'); // Ajuste o caminho do modelo
    }
};

export const predictResponse = async (preprocessedText: tf.Tensor): Promise<string> => {
    if (!model) await loadModel();

    const prediction = model?.predict(preprocessedText) as tf.Tensor;
    const responseIndex = (await prediction.argMax(-1).data())[0];
    const responses = ["Resposta 1", "Resposta 2", "Desculpe, não entendi."];
    return responses[responseIndex] || "Desculpe, não entendi.";
};
