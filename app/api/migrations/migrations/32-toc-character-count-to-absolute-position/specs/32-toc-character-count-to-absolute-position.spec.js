import testingDB from 'api/utils/testing_db';
import errorLog from 'api/log/errorLog';
import { config } from 'api/config';
import { catchErrors } from 'api/utils/jasmineHelpers';
import fixtures, {
  documentWithTocId,
  documentWithVoidTocId,
  documentWithoutPdfInfoId,
} from './fixtures.js';
import migration from '../index.js';

describe('migration toc-character-count-to-absolute-position', () => {
  beforeEach(done => {
    spyOn(process.stdout, 'write');
    spyOn(errorLog, 'error');
    config.defaultTenant.uploadedDocuments = __dirname;
    testingDB
      .clearAllAndLoad(fixtures)
      .then(done)
      .catch(catchErrors(done));
  });

  afterAll(done => {
    testingDB.disconnect().then(done);
  });

  it('should have a delta number', () => {
    expect(migration.delta).toBe(32);
  });

  it('should convert table of content to absolute position', async () => {
    await migration.up(testingDB.mongodb);

    const connections = await testingDB.mongodb
      .collection('files')
      .find({ _id: documentWithTocId })
      .toArray();

    expect(connections).toEqual([
      expect.objectContaining({
        toc: [
          {
            selectionRectangles: [
              {
                height: 14,
                left: 371,
                pageNumber: 2,
                top: 722,
                width: 151,
              },
            ],
            label: 'PUBLISH WITH PURPOSE',
            indentation: 0,
          },
          {
            selectionRectangles: [
              {
                height: 14,
                left: 365,
                pageNumber: 3,
                top: 722,
                width: 163,
              },
            ],
            label: 'BUILD A CUSTOM LIBRARY',
            indentation: 1,
          },
          {
            selectionRectangles: [
              {
                height: 14,
                left: 355,
                pageNumber: 4,
                top: 722,
                width: 184,
              },
            ],
            label: 'DISCOVER NEW INFORMATION',
            indentation: 2,
          },
        ],
      }),
    ]);
  });

  it('should leave empty toc documents', async () => {
    await migration.up(testingDB.mongodb);

    const connections = await testingDB.mongodb
      .collection('files')
      .find({ _id: documentWithVoidTocId })
      .toArray();

    expect(connections).toEqual([
      expect.objectContaining({
        toc: [],
      }),
    ]);
  });

  it('should leave empty toc when no pdfinfo', async () => {
    await migration.up(testingDB.mongodb);

    const connections = await testingDB.mongodb
      .collection('files')
      .find({ _id: documentWithoutPdfInfoId })
      .toArray();

    expect(connections).toEqual([
      expect.objectContaining({
        toc: [],
      }),
    ]);
  });
});
