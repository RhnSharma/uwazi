/** @format */

import { ConnectionsList } from 'app/ConnectionsList';
import { shallow } from 'enzyme';
import Immutable from 'immutable';
import React from 'react';
import { OneUpEntityViewerBase } from '../OneUpEntityViewer';

describe('EntityViewer', () => {
  let component;
  let props;
  let context;
  let instance;

  beforeEach(() => {
    context = { confirm: jasmine.createSpy('confirm') };
    props = {
      entity: { title: 'Title' },
      templates: Immutable.fromJS([
        {
          _id: 'template1',
          properties: [{ name: 'source_property', label: 'label1' }],
          name: 'template1Name',
        },
        {
          _id: 'template2',
          properties: [{ name: 'source_property', label: 'label2' }],
          name: 'template2Name',
        },
      ]),
      relationTypes: [{ _id: 'abc', name: 'relationTypeName' }],
      connectionsGroups: Immutable.fromJS([
        { key: 'g1', templates: [{ _id: 't1', count: 1 }] },
        { key: 'g2', templates: [{ _id: 't2', count: 2 }, { _id: 't3', count: 3 }] },
      ]),
      selectedConnection: false,
      tab: 'info',
      oneUpState: {},
      deleteConnection: jasmine.createSpy('deleteConnection'),
      startNewConnection: jasmine.createSpy('startNewConnection'),
      showTab: jasmine.createSpy('showTab'),
      connectionsChanged: jasmine.createSpy('connectionsChanged'),
      switchOneUpEntity: jasmine.createSpy('switchOneUpEntity'),
      toggleOneUpFullEdit: jasmine.createSpy('toggleOneUpFullEdit'),
      toggleOneUpLoadConnections: jasmine.createSpy('toggleOneUpLoadConnections'),
      mlThesauri: [],
    };
  });

  const render = () => {
    component = shallow(<OneUpEntityViewerBase {...props} />, { context });
    instance = component.instance();
  };

  it('should render', () => {
    render();
    expect(component).toMatchSnapshot();
  });

  it('should render the ConnectionsList passing deleteConnection as prop', () => {
    render();

    component
      .find(ConnectionsList)
      .props()
      .deleteConnection({ sourceType: 'not metadata' });
    expect(context.confirm).toHaveBeenCalled();
  });

  describe('deleteConnection', () => {
    beforeEach(() => {
      render();
    });

    it('should confirm deleting a Reference', () => {
      instance.deleteConnection({});
      expect(context.confirm).toHaveBeenCalled();
      expect(props.deleteConnection).not.toHaveBeenCalled();
    });

    it('should delete the reference upon accepting', () => {
      const ref = { _id: 'r1' };
      instance.deleteConnection(ref);
      context.confirm.calls.argsFor(0)[0].accept();
      expect(props.deleteConnection).toHaveBeenCalledWith(ref);
    });

    it('should not atempt to delete references whos source is metadata', () => {
      const ref = { _id: 'r1', sourceType: 'metadata' };
      instance.deleteConnection(ref);
      expect(context.confirm).not.toHaveBeenCalled();
      expect(props.deleteConnection).not.toHaveBeenCalled();
    });
  });

  describe('closing side panel', () => {
    beforeEach(() => {
      render();
      component.find('.closeSidepanel').simulate('click');
      component.update();
    });
    it('should close the side panel when close button is clicked', () => {
      expect(component.find('.entity-info').prop('open')).toBe(false);
      expect(component.find('.entity-connections').prop('open')).toBe(false);
      expect(component.find('.show-info-sidepanel-context-menu').prop('show')).toBe(true);
    });
    it('should reveal side panel when context menu is clicked', () => {
      expect(component.find('.entity-info').prop('open')).toBe(false);

      component.find('.show-info-sidepanel-menu').prop('openPanel')();
      component.update();

      expect(component.find('.entity-info').prop('open')).toBe(true);
      expect(component.find('.show-info-sidepanel-context-menu').prop('show')).toBe(false);
    });
  });
});
