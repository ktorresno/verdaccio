import React from 'react';

import { store } from '../../store/store';
import { cleanup, fireEvent, renderWithStore, screen } from '../../test/test-react-testing-library';
import ActionBar from './ActionBar';

const defaultPackageMeta = {
  _uplinks: {},
  latest: {
    name: 'verdaccio-ui/local-storage',
    version: '8.0.1-next.1',
    dist: {
      fileCount: 0,
      unpackedSize: 0,
      tarball: 'http://localhost:8080/bootstrap/-/bootstrap-4.3.1.tgz',
    },
    homepage: 'https://verdaccio.org',
    bugs: {
      url: 'https://github.com/verdaccio/monorepo/issues',
    },
  },
};

describe('<ActionBar /> component', () => {
  afterEach(() => {
    cleanup();
  });

  test('should render the component in default state', () => {
    const { container } = renderWithStore(<ActionBar packageMeta={defaultPackageMeta} />, store);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('when there is no action bar data', () => {
    const packageMeta = {
      ...defaultPackageMeta,
      latest: {
        ...defaultPackageMeta.latest,
        homepage: undefined,
        bugs: undefined,
        dist: {
          ...defaultPackageMeta.latest.dist,
          tarball: undefined,
        },
      },
    };

    const { container } = renderWithStore(<ActionBar packageMeta={packageMeta} />, store);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('when there is a button to download a tarball', () => {
    renderWithStore(<ActionBar packageMeta={defaultPackageMeta} />, store);
    expect(screen.getByLabelText('action-bar-action.download-tarball')).toBeTruthy();
  });

  test('when there is a button to raw manifest', () => {
    renderWithStore(<ActionBar packageMeta={defaultPackageMeta} showRaw={true} />, store);
    expect(screen.getByLabelText('action-bar-action.raw')).toBeTruthy();
  });

  test('when click button to raw manifest open a dialog with viewver', () => {
    renderWithStore(<ActionBar packageMeta={defaultPackageMeta} showRaw={true} />, store);
    fireEvent.click(screen.getByLabelText('action-bar-action.raw'));
    // TODO: fix this part
    // expect(screen.getByTestId('raw-viewver-dialog')).toBeInTheDocument();
  });

  test('should not display download tarball button', () => {
    renderWithStore(<ActionBar packageMeta={defaultPackageMeta} showRaw={true} />, store);
    expect(screen.queryByLabelText('Download tarball')).toBeFalsy();
  });

  test('should not display show raw button', () => {
    renderWithStore(<ActionBar packageMeta={defaultPackageMeta} showRaw={false} />, store);
    expect(screen.queryByLabelText('action-bar-action.raw')).toBeFalsy();
  });

  test('when there is a button to open an issue', () => {
    renderWithStore(<ActionBar packageMeta={defaultPackageMeta} />, store);
    // TODO: should be visible by text
    // expect(screen.getByLabelText('action-bar-action.open-an-issue')).toBeTruthy();
    expect(screen.getByTestId('BugReportIcon')).toBeInTheDocument();
  });
});
