import { catchErrors } from 'api/utils/jasmineHelpers';
import createNightmare from '../helpers/nightmare';
import selectors from '../helpers/selectors.js';
import insertFixtures from '../helpers/insertFixtures';

//iphone 6 measures
const nightmare = createNightmare(376, 667);

describe('mobile somke test', () => {
  beforeAll(async () => insertFixtures());
  afterAll(async () => nightmare.end());

  describe('library view', () => {
    it('when clicking on the search button a side panel should appear', done => {
      nightmare
        .login('admin', 'admin')
        .gotoLibrary()
        .click(selectors.libraryView.searchInLibrary)
        .wait('.side-panel.is-active')
        .exists('.side-panel.is-active')
        .then(result => {
          expect(result).toBe(true);
          done();
        })
        .catch(catchErrors(done));
    });
  });

  describe('Entity view', () => {
    it('should show attachments', done => {
      nightmare
        .gotoLibrary()
        .waitToClick('#app > div.content > header > button')
        .waitToClick(selectors.libraryView.firstEntityViewButton)
        .wait(selectors.entityView.firstAttachmentTitle)
        .getInnerText(selectors.entityView.firstAttachmentTitle)
        .then(attachmentName => {
          expect(attachmentName).toBeDefined();
          done();
        })
        .catch(catchErrors(done));
    }, 40000);
  });
});
