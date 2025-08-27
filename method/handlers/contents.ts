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
  const content = contentRepository.create({title, body});
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
  return await contentRepository.remove(content); /*nullを返却しないためにreturn*/
}  

export const deleteMultipleContents = async (ids: string[]) => {
  // IDの配列を数値に変換
  const numericIds = ids.map(id => Number(id));
  
  // 指定されたIDのコンテンツを一括取得
  const contents = await contentRepository.find({
    where: numericIds.map(id => ({ id }))
  });
  
  if (contents.length === 0) {
    return { deletedCount: 0, message: "削除対象のコンテンツが見つかりませんでした" };
  }
  
  // 一括削除を実行
  const deletedContents = await contentRepository.remove(contents);
  
  return {
    deletedCount: deletedContents.length,
    deletedIds: deletedContents.map((content: Content) => content.id),
    message: `${deletedContents.length}件のコンテンツを削除しました`
  };
}  
