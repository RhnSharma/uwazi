import React from 'react';
import {shallow} from 'enzyme';
import {LocalForm} from 'react-redux-form';
import {NewUser} from '../NewUser';

describe('NewUser', () => {
  let component;
  let props;

  beforeEach(() => {
    props = {
      saveUser: jasmine.createSpy('saveUser').and.returnValue(Promise.resolve())
    };
  });

  let render = () => {
    component = shallow(<NewUser {...props} />);
  };

  describe('render', () => {
    it('should render a form', () => {
      render();
      expect(component.find(LocalForm).length).toBe(1);
    });
  });

  describe('submit', () => {
    it('should call saveUser', () => {
      render();
      const instance = component.instance();
      const user = {username: 'spidey', email: 'peter@parker.com'};
      instance.submit(user);
      expect(props.saveUser).toHaveBeenCalledWith(user);
    });
  });
});
