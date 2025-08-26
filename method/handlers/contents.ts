import { AppDataSource } from "../data-source";
import { Content } from "../src/entities/Content";

// 名前で判断しやすい。Entity Managerだと、引数を見るまで何のEntityを操作しているのかがわかりにくい。
const contentRepository = AppDataSource.getRepository(Content);

/**
 * 全てのコンテンツを取得する
 * @returns {Promise<Content[]>} コンテンツの配列
 * @description データベースから全てのコンテンツを取得して返却します
 */
export const getContents = async () => {
  const contents = await contentRepository.find();
  return contents;
}

/**
 * 新しいコンテンツを作成する
 * @param {string} title - コンテンツのタイトル
 * @param {string} body - コンテンツの本文
 * @returns {Promise<Content>} 作成されたコンテンツ
 * @description 指定されたタイトルと本文で新しいコンテンツを作成し、データベースに保存します
 */
export const postContents = async (title: string, body: string) => {
  const content = contentRepository.create({title, body});
  await contentRepository.save(content);
  return content;
}

/**
 * 指定されたIDのコンテンツを取得する
 * @param {string} id - 取得したいコンテンツのID
 * @returns {Promise<Content | null>} 指定されたIDのコンテンツ、存在しない場合はnull
 * @description 指定されたIDのコンテンツをデータベースから取得します
 */
export const getContent = async (id: string) => {
  const content = await contentRepository.findOne({
    where: {id: Number(id)},
  });
  return content;
}

/**
 * 指定されたIDのコンテンツを更新する
 * @param {string} id - 更新したいコンテンツのID
 * @param {string} title - 新しいタイトル
 * @param {string} body - 新しい本文
 * @returns {Promise<Content | null>} 更新されたコンテンツ、存在しない場合はnull
 * @description 指定されたIDのコンテンツのタイトルと本文を更新します
 */
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

/**
 * 指定されたIDのコンテンツを削除する
 * @param {string} id - 削除したいコンテンツのID
 * @returns {Promise<Content | null>} 削除されたコンテンツ、存在しない場合はnull
 * @description 指定されたIDのコンテンツをデータベースから削除します
 */
export const deleteContent = async (id: string) => {
  const content = await contentRepository.findOne({
    where: {id: Number(id)},
  });
  if (content == null) {
    return null;
  }
  return await contentRepository.remove(content); /*nullを返却しないためにreturn*/
}  
