import { getContents, postContents, getContent, putContent, deleteContent, deleteMultipleContents } from './contents';
import { AppDataSource } from '../data-source';
import { Content } from '../src/entities/Content';

const contentRepository = AppDataSource.getRepository(Content);
const mockCreate = jest.fn(); /* create時点では、id:undefindを許容したい */
contentRepository.create = mockCreate;

const mockFind = jest.spyOn(contentRepository, 'find');
const mockFindOne = jest.spyOn(contentRepository, 'findOne');
const mockSave = jest.spyOn(contentRepository, 'save');
const mockRemove = jest.spyOn(contentRepository, 'remove') as jest.MockedFunction<typeof contentRepository.remove>;

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks
});

test('getContents', async () => {
  mockFind.mockResolvedValue([{ id: 1, title: 'title', body: 'body' }]);

  const contents = await getContents();

  expect(contents[0].id).toStrictEqual(1);
  expect(contents[0].title).toStrictEqual('title');
  expect(contents[0].body).toStrictEqual('body');

  expect(mockFind).toHaveBeenCalledTimes(1);
})

test('getContents 失敗時', async () => {
  expect.assertions(1);

  mockFind.mockRejectedValue(new Error('something error'));
  await expect(getContents()).rejects.toThrow('something error');
  })

test('postContents', async () => {
  mockCreate.mockReturnValue({ title: 'title', body: 'body' });
  mockSave.mockResolvedValue({ id: 1, title: 'title', body: 'body' });

  const reqMock = { title: 'title', body: 'body' };
  const content = await postContents(reqMock.title, reqMock.body);

  expect(content.title).toStrictEqual('title');
  expect(content.body).toStrictEqual('body');

  expect(mockCreate).toHaveBeenCalledTimes(1);
  const [createArg] = mockCreate.mock.calls[0];
  expect(createArg.title).toStrictEqual('title');
  expect(createArg.body).toStrictEqual('body');

  expect(mockSave).toHaveBeenCalledTimes(1);
  const [saveArg] = mockSave.mock.calls[0];
  expect(saveArg.title).toStrictEqual('title');
  expect(saveArg.body).toStrictEqual('body');
})

test('postContents 失敗時', async () => {
  expect.assertions(1);

  mockCreate.mockReturnValue({ title: 'title', body: 'body' });
  mockSave.mockRejectedValue(new Error('something error'));

  const reqMock = { title: 'title', body: 'body' };
  await expect(postContents(reqMock.title, reqMock.body)).rejects.toThrow('something error');
  })

test('getContent', async () => {
  mockFindOne.mockResolvedValue({ id: 1, title: 'title', body: 'body' });

  const reqMock = { id: '1' };
  const content = await getContent(reqMock.id);

  expect(content).toStrictEqual({id: 1, title: 'title', body: 'body'});

  expect(mockFindOne).toHaveBeenCalledTimes(1);
  const [findOneArg] = mockFindOne.mock.calls[0];
  expect(findOneArg.where).toStrictEqual({ id: 1 });
})

test('getContent null', async () => {
  mockFindOne.mockResolvedValue(null);

  const reqMock = { id: '1' };
  const content = await getContent(reqMock.id);

  expect(content).toBeNull();

  expect(mockFindOne).toHaveBeenCalledTimes(1);
  const [findOneArg] = mockFindOne.mock.calls[0];
  expect(findOneArg.where).toStrictEqual({ id: 1 });
})

test('getContent 失敗時', async () => {
  expect.assertions(1);

  mockFindOne.mockRejectedValue(new Error('something error'));

  const reqMock = { id: '1' };
  await expect(getContent(reqMock.id)).rejects.toThrow('something error');
  })

test('putContent', async () => {
  mockFindOne.mockResolvedValue({ id: 1, title: 'title', body: 'body' });
  mockSave.mockResolvedValue({ id: 1, title: 'updateTitle', body: 'updateBody' });

  const reqMock = { id: '1', title: 'updateTitle', body: 'updateBody' };
  const content = await putContent(reqMock.id, reqMock.title, reqMock.body);

  expect(content).toStrictEqual({id: 1, title: 'updateTitle', body: 'updateBody'});

  expect(mockFindOne).toHaveBeenCalledTimes(1);
  const [findOneArg] = mockFindOne.mock.calls[0];
  expect(findOneArg.where).toStrictEqual({ id: 1 });

  expect(mockSave).toHaveBeenCalledTimes(1);
  const [saveArg] = mockSave.mock.calls[0];
  expect(saveArg.title).toStrictEqual('updateTitle');
  expect(saveArg.body).toStrictEqual('updateBody');
})

test('putContent null', async () => {
  mockFindOne.mockResolvedValue(null);

  const reqMock = { id: '1', title: 'updateTitle', body: 'updateBody' };
  const content = await putContent(reqMock.id, reqMock.title, reqMock.body);

  expect(content).toBeNull();

  expect(mockFindOne).toHaveBeenCalledTimes(1);
  const [findOneArg] = mockFindOne.mock.calls[0];
  expect(findOneArg.where).toStrictEqual({ id: 1 });
})

test('putContent 失敗時', async () => {
  expect.assertions(1);

  mockFindOne.mockRejectedValue(new Error('something error'));

  const reqMock = { id: '1', title: 'updateTitle', body: 'updateBody' };
  await expect(putContent(reqMock.id, reqMock.title, reqMock.body)).rejects.toThrow('something error');
  })

test('deleteContent', async () => {
  mockFindOne.mockResolvedValue({ id: 1, title: 'title', body: 'body' });
  // mockRemove.mockResolvedValueの値はresponseに影響しないためなんでも良い
  mockRemove.mockResolvedValue({ id: 1, title: 'title', body: 'body' });

  const reqMock = { id: '1' };
  const content = await deleteContent(reqMock.id);

  expect(content).toStrictEqual({id: 1, title: 'title', body: 'body'});

  expect(mockFindOne).toHaveBeenCalledTimes(1);
  const [findOneArg] = mockFindOne.mock.calls[0];
  expect(findOneArg.where).toStrictEqual({ id: 1 });

  expect(mockRemove).toHaveBeenCalledTimes(1);
  const [removeArg] = mockRemove.mock.calls[0];
  expect(removeArg.id).toStrictEqual(1);
})

test('deleteContent null', async () => {
  mockFindOne.mockResolvedValue(null);

  const reqMock = { id: '1'};
  const content = await deleteContent(reqMock.id);

  expect(content).toBeNull();

  expect(mockFindOne).toHaveBeenCalledTimes(1);
  const [findOneArg] = mockFindOne.mock.calls[0];
  expect(findOneArg.where).toStrictEqual({ id: 1 });
})

test('deleteContent 失敗時', async () => {
  expect.assertions(1);

  mockFindOne.mockRejectedValue(new Error('something error'));

  const reqMock = { id: '1' };
  await expect(deleteContent(reqMock.id)).rejects.toThrow('something error');
})

test('deleteMultipleContents', async () => {
  const mockContents = [
    { id: 1, title: 'title1', body: 'body1' },
    { id: 2, title: 'title2', body: 'body2' }
  ];
  mockFind.mockResolvedValue(mockContents);
  (mockRemove as jest.Mock).mockResolvedValue(mockContents);

  const reqMock = { ids: ['1', '2'] };
  const result = await deleteMultipleContents(reqMock.ids);

  expect(result.deletedCount).toStrictEqual(2);
  expect(result.deletedIds).toStrictEqual([1, 2]);
  expect(result.message).toStrictEqual('2件のコンテンツを削除しました');

  expect(mockFind).toHaveBeenCalledTimes(1);
  const [findArg] = mockFind.mock.calls[0];
  expect(findArg?.where).toEqual([{ id: 1 }, { id: 2 }]);

  expect(mockRemove).toHaveBeenCalledTimes(1);
  const [removeArg] = mockRemove.mock.calls[0];
  expect(removeArg).toEqual(mockContents);
})

test('deleteMultipleContents 削除対象なし', async () => {
  mockFind.mockResolvedValue([]);

  const reqMock = { ids: ['999', '1000'] };
  const result = await deleteMultipleContents(reqMock.ids);

  expect(result.deletedCount).toStrictEqual(0);
  expect(result.message).toStrictEqual('削除対象のコンテンツが見つかりませんでした');

  expect(mockFind).toHaveBeenCalledTimes(1);
  const [findArg] = mockFind.mock.calls[0];
  expect(findArg?.where).toEqual([{ id: 999 }, { id: 1000 }]);

  expect(mockRemove).not.toHaveBeenCalled();
})

test('deleteMultipleContents 失敗時', async () => {
  expect.assertions(1);

  mockFind.mockRejectedValue(new Error('something error'));

  const reqMock = { ids: ['1', '2'] };
  await expect(deleteMultipleContents(reqMock.ids)).rejects.toThrow('something error');
})