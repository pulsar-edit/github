import React from 'react';
import {shallow} from 'enzyme';

import ChangedFilesCountView from '../../lib/views/changed-files-count-view';

describe('ChangedFilesCountView', function() {
  let wrapper;

  it('renders diff icon', function() {
    wrapper = shallow(<ChangedFilesCountView />);
    assert.isTrue(wrapper.html().includes('git-commit'));
  });

  it('renders merge conflict icon if there is a merge conflict', function() {
    wrapper = shallow(<ChangedFilesCountView mergeConflictsPresent={true} />);
    assert.isTrue(wrapper.html().includes('icon-alert'));
  });

  it('renders singular count for one file', function() {
    wrapper = shallow(<ChangedFilesCountView changedFilesCount={1} />);
    assert.isTrue(wrapper.text().includes('Git (1)'));
  });

  it('renders multiple count if more than one file', function() {
    wrapper = shallow(<ChangedFilesCountView changedFilesCount={2} />);
    assert.isTrue(wrapper.text().includes('Git (2)'));
  });
});
