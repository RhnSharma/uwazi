import React, { useEffect, useState } from 'react';
import { Icon } from 'UI';
import { UserGroupSchema, GroupMemberSchema } from 'shared/types/userGroupType';
import { t } from 'app/I18N';
import { ConfirmButton, SidePanel } from 'app/Layout';
import MultiSelect from 'app/Forms/components/MultiSelect';

export interface UserGroupSidePanelProps {
  userGroup: UserGroupSchema;
  users: GroupMemberSchema[];
  opened: boolean;
  closePanel: (event: any) => void;
  onSave: (event: any) => void;
  onDelete: (event: any) => void;
}

const UserGroupSidePanelComponent = ({
  userGroup,
  users,
  opened,
  closePanel,
  onSave,
  onDelete,
}: UserGroupSidePanelProps) => {
  const [groupMembers, setGroupMembers] = useState<GroupMemberSchema[]>([]);
  const [name, setName] = useState<string>();
  const [availableUsers, setAvailableUsers] = useState<GroupMemberSchema[]>([]);

  function updateAvailableUsers(members: GroupMemberSchema[]) {
    const membersIds = members.map(member => member._id);
    const filteredUsers = users.filter((user: GroupMemberSchema) => !membersIds.includes(user._id));
    setAvailableUsers(filteredUsers);
  }

  useEffect(() => {
    setName(userGroup.name);
    setGroupMembers([...userGroup.members]);
    updateAvailableUsers(userGroup.members);
  }, [userGroup]);

  function addUsers(userIds: string[]) {
    const addedUsers = users
      .filter((user: GroupMemberSchema) => userIds.includes(user._id as string))
      .map(user => ({
        _id: user._id,
        username: user.username,
        role: user.role,
        email: user.email,
      }));
    const updatedMembers = groupMembers.concat(addedUsers);
    setGroupMembers(updatedMembers);
    updateAvailableUsers(updatedMembers);
  }

  function removeUser(user: GroupMemberSchema) {
    const index = groupMembers.indexOf(user);
    groupMembers.splice(index, 1);
    setGroupMembers([...groupMembers]);
    updateAvailableUsers(groupMembers);
  }

  function updateGroup(event: any) {
    setName(event.target.value);
  }

  function saveGroup() {
    const groupToSave = { ...userGroup, name, members: groupMembers };
    onSave(groupToSave);
  }

  function deleteGroup() {
    onDelete(userGroup);
  }

  return (
    <SidePanel open={opened}>
      <div className="sidepanel-header">{`${userGroup._id ? 'Edit' : 'Add'} Group`}</div>
      <div className="sidepanel-body">
        <form id="userGroupFrom" className="user-group-form" onSubmit={saveGroup}>
          <div id="name_field" className="form-group nested-selector">
            <label htmlFor="userGroup.name">Name of the group</label>
            <input
              type="text"
              className="form-control"
              autoComplete="off"
              value={name}
              onChange={updateGroup}
            />
          </div>
          <div className="search-box search-user nested-selector">
            <MultiSelect
              placeholder={t('System', 'Add users', null, false)}
              options={availableUsers}
              optionsLabel="username"
              optionsValue="_id"
              onChange={addUsers}
              optionsToShow={0}
              showAll
            />
          </div>
          <div className="user-group-members">
            {groupMembers.map(member => (
              <div key={member._id as string} className="user-group-member">
                <div>{member.username}</div>
                <div>
                  <button
                    type="button"
                    onClick={() => removeUser(member)}
                    className="btn btn-danger btn-xs template-remove"
                  >
                    <Icon icon="trash-alt" />
                    &nbsp;
                    <span>{t('System', 'Remove')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </form>
      </div>
      <div className="sidepanel-footer">
        <button
          id="discardChangesBtn"
          type="button"
          className="btn btn-primary"
          onClick={closePanel}
          aria-label="Close side panel"
        >
          <Icon icon="times" />
          <span className="btn-label">Discard Changes</span>
        </button>
        <ConfirmButton id="deleteBtn" className="btn btn-outline-danger" action={deleteGroup}>
          <Icon icon="trash-alt" />
          <span className="btn-label">Delete Group</span>
        </ConfirmButton>
        <button type="submit" form="userGroupFrom" className="btn btn-success">
          <Icon icon="save" />
          <span id="submitLabel" className="btn-label">
            {`${userGroup._id ? 'Save' : 'Create'} Group`}
          </span>
        </button>
      </div>
    </SidePanel>
  );
};

export const UserGroupSidePanel = UserGroupSidePanelComponent;