import Immutable from 'immutable';
import * as actions from 'app/Uploads/actions/uploadsActions';

import uiReducer from 'app/Uploads/reducers/uiStateReducer';
import 'jasmine-immutablejs-matchers';

describe('uploads uiState reducer', () => {
  const initialState = Immutable.fromJS({selectedDocuments: []});

  describe('when state is undefined', () => {
    it('should return default state', () => {
      let newState = uiReducer();
      expect(newState).toEqual(initialState);
    });
  });

  describe('selectDocument', () => {
    it('should set selected document', () => {
      let newState = uiReducer(initialState, actions.selectDocument({_id: 'document'}));
      expect(newState.get('selectedDocuments').first().get('_id')).toBe('document');
    });

    it('should not select an already selected document', () => {
      let newState = uiReducer(initialState, actions.selectDocument({_id: 'document'}));
      newState = uiReducer(newState, actions.selectDocument({_id: 'document'}));
      expect(newState.get('selectedDocuments').size).toBe(1);
    });
  });

  describe('unselectDocument', () => {
    it('should set selected document', () => {
      let newState = uiReducer(Immutable.fromJS({selectedDocuments: [{_id: 'document'}]}), actions.unselectDocument('document'));
      expect(newState.toJS().selectedDocuments.length).toBe(0);
    });
  });

  describe('unselectAllDocuments', () => {
    it('should set selected document', () => {
      let newState = uiReducer(Immutable.fromJS({selectedDocuments: [{_id: 'document'}]}), actions.unselectAllDocuments());
      expect(newState.toJS().selectedDocuments.length).toBe(0);
    });
  });
});
