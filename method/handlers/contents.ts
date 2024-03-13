import { AppDataSource } from "../data-source";
import { Content } from "../src/entities/Content";

// 名前で判断しやすい。Entity Managerだと、引数を見るまで何のEntityを操作しているのかがわかりにくい。
const contentRepository = AppDataSource.getRepository(Content);

// 以下、/contentsのGET・POST, /contents/:idのGET・PUT・DELETEの処理を行う関数を定義
export const getContents = async () => {
  const contents = await contentRepository.find();
  return contents;
}

export const postContents = async (title: string, body: string) => {
  const content = new Content(title, body);
  await contentRepository.save(content);
  return content;
}

export const getContent = async (id: string) => {
  const content = await contentRepository.findOne({
    where: {id: Number(id)},
  });
  return content;
}

export const putContent = async (id: string, title: string, body: string) => {
  const content = await contentRepository.findOne({
    where: {id: Number(id)},
  });
  if (content == null) {
    return null;
  }
  content.title = title;
  content.body = body;
  await contentRepository.save(content);
  return content;
}

export const deleteContent = async (id: string) => {
  const content = await contentRepository.findOne({
    where: {id: Number(id)},
  });
  if (content == null) {
    return null;
  }
  return await contentRepository.remove(content); 
}  
