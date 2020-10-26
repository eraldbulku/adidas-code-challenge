import mongoose from 'mongoose';

export const wait = (timeInMilliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeInMilliseconds));
};

export const parseDocFromModel = (model: mongoose.Document) => {
  return model['_doc'] ? model['_doc'] : model;
}
