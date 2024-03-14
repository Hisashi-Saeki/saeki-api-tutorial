import { getContents, postContents, getContent, putContent, deleteContent } from './contents';
import { AppDataSource } from '../data-source';
import { Content } from '../src/entities/Content';

// example: find() → mockFind()の方がmock化されていると分かる
const mockFind = jest.fn();
const mockCreate = jest.fn();
const mockSave = jest.fn();
const mockFindOne = jest.fn();
const mockRemove = jest.fn();

const contentRepository = AppDataSource.getRepository(Content);
contentRepository.find = mockFind;
contentRepository.create = mockCreate;
contentRepository.save = mockSave;
contentRepository.findOne = mockFindOne;
contentRepository.remove = mockRemove;

beforeEach(() => {
  mockFind.mockClear();
  mockCreate.mockClear();
  mockSave.mockClear();
  mockFindOne.mockClear();
  mockRemove.mockClear();
})

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

  try {
    await getContents();
  } catch (err) {
    if(err instanceof Error) {
    expect(err.message).toStrictEqual('something error');
  }
}})

test('postContents', async () => {
  mockCreate.mockReturnValue({title: 'title', body: 'body' });
  mockSave.mockResolvedValue({title: 'title', body: 'body' });

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

  mockCreate.mockRejectedValue(new Error('something error'));

  const reqMock = { title: 'title', body: 'body' };

  try {
    await postContents(reqMock.title, reqMock.body);
  } catch (err) {
    if(err instanceof Error) {
    expect(err.message).toStrictEqual('something error');
  }
}})

test('getContent', async () => {
  mockFindOne.mockResolvedValue({ id: 1, title: 'title', body: 'body' });

  const reqMock = { id: '1' };
  const content = await getContent(reqMock.id);

  if(content === null) {
    expect(content).toBeNull();
  } else {
    expect(content.id).toStrictEqual(1);
    expect(content.title).toStrictEqual('title');
    expect(content.body).toStrictEqual('body');
  }

  expect(mockFindOne).toHaveBeenCalledTimes(1);
  const [findOneArg] = mockFindOne.mock.calls[0];
  expect(findOneArg.where.id).toStrictEqual(1);
})

test('getContent 失敗時', async () => {
  expect.assertions(1);

  mockFindOne.mockRejectedValue(new Error('something error'));

  const reqMock = { id: '1' };

  try {
    await getContent(reqMock.id);
  } catch (err) {
    if(err instanceof Error) {
    expect(err.message).toStrictEqual('something error');
  }
}})

test('putContent', async () => {
  mockFindOne.mockResolvedValue({ id: 1, title: 'title', body: 'body' });
  mockSave.mockResolvedValue({ id: 1, title: 'updateTitle', body: 'updateBody' });

  const reqMock = { id: '1', title: 'updateTitle', body: 'updateBody' };
  const content = await putContent(reqMock.id, reqMock.title, reqMock.body);

  if(content === null) {
    expect(content).toBeNull();
  } else {
    expect(content.id).toStrictEqual(1);
    expect(content.title).toStrictEqual('updateTitle');
    expect(content.body).toStrictEqual('updateBody');
  }

  expect(mockFindOne).toHaveBeenCalledTimes(1);
  const [findOneArg] = mockFindOne.mock.calls[0];
  expect(findOneArg.where.id).toStrictEqual(1);

  expect(mockSave).toHaveBeenCalledTimes(1);
  const [saveArg] = mockSave.mock.calls[0];
  expect(saveArg.title).toStrictEqual('updateTitle');
  expect(saveArg.body).toStrictEqual('updateBody');
})

test('putContent 失敗時', async () => {
  expect.assertions(1);

  mockFindOne.mockRejectedValue(new Error('something error'));

  const reqMock = { id: '1', title: 'updateTitle', body: 'updateBody' };

  try {
    await putContent(reqMock.id, reqMock.title, reqMock.body);
  } catch (err) {
    if(err instanceof Error) {
    expect(err.message).toStrictEqual('something error');
  }
}})

test('deleteContent', async () => {
  mockFindOne.mockResolvedValue({ id: 1, title: 'title', body: 'body' });
  // mockRemove.mockResolvedValueの値はresponseに影響しないためなんでも良い
  mockRemove.mockResolvedValue({ id: undefined, title: 'title', body: 'body' });

  const reqMock = { id: '1' };
  const content = await deleteContent(reqMock.id);

  if(content === null) {
    expect(content).toBeNull();
  } else {
    expect(content.id).toStrictEqual(undefined);
    expect(content.title).toStrictEqual('title');
    expect(content.body).toStrictEqual('body');
  }

  expect(mockFindOne).toHaveBeenCalledTimes(1);
  const [findOneArg] = mockFindOne.mock.calls[0];
  expect(findOneArg.where.id).toStrictEqual(1);

  expect(mockRemove).toHaveBeenCalledTimes(1);
  const [removeArg] = mockRemove.mock.calls[0];
  expect(removeArg.id).toStrictEqual(1);
})

test('deleteContent 失敗時', async () => {
  expect.assertions(1);

  mockFindOne.mockRejectedValue(new Error('something error'));

  const reqMock = { id: '1' };

  try {
    await deleteContent(reqMock.id);
  } catch (err) {
    if(err instanceof Error) {
    expect(err.message).toStrictEqual('something error');
  }
}})