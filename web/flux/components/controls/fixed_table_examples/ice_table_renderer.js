import React from 'react/addons';
import cx from 'classnames';

const K_ROW_HEIGHT = 105;
const K_HEADER_HEIGHT = 165;
const K_MINI_HEADER_HEIGHT = 40;

export {K_ROW_HEIGHT, K_HEADER_HEIGHT, K_MINI_HEADER_HEIGHT};

const K_STYLE_IMAGE = {
  width: K_ROW_HEIGHT * 4 / 3,
  height: K_ROW_HEIGHT,
  borderLeft: '1px solid white'
};

const K_KEY_COLUMN_RANK = 'K_KEY_COLUMN_RANK';
const K_KEY_COLUMN_DESCRIPTION = 'K_KEY_COLUMN_DESCRIPTION';
const K_KEY_COLUMN_PHONE = 'K_KEY_COLUMN_PHONE';

const K_ROW_CLASS_NAME_BORDER_LINE = 'ice-table ice-table--line';
const K_ROW_CLASS_NAME_EVEN = 'ice-table ice-table--row-even';
const K_ROW_CLASS_NAME_ODD = 'ice-table ice-table--row-odd';

const K_ROW_CLASS_NAME_EVEN_HOVERED = 'ice-table ice-table--row-even ice-table--row-hovered';
const K_ROW_CLASS_NAME_ODD_HOVERED = 'ice-table ice-table--row-odd ice-table--row-hovered';

const K_SHOW_FILTERS_TEXT = 'Show filters';

// DATA DEFINITION
const columns = [
  {
    dataKey: K_KEY_COLUMN_RANK,
    fixed: false,
    flexGrow: 1,
    label: '',
    width: 105
  },
  {
    dataKey: K_KEY_COLUMN_DESCRIPTION,
    // bugs in fixed-data-table flex realization use fixed size to precise calculus
    flexGrow: 9999999999,
    fixed: false,
    label: '',
    width: 100
  },
  {
    dataKey: K_KEY_COLUMN_PHONE,
    flexGrow: 1,
    fixed: false,
    label: '',
    width: 140
  }
];

export {columns};

export function renderHeader(resetFn) {
  return (
    <div className="ice-table-header">
      <div className="ice-table-header__filter-line-header">BEST FILTERS EVER (empty)</div>
      <div className="ice-table-header__filter-line">
        <hr />
      </div>
      <div className="ice-table-header__filter-line">
        <hr />
      </div>
      <div className="ice-table-header__filter-line">
        <hr />
      </div>
      <div className="ice-table-header__filter-line">
        <hr />
      </div>
      <div className="ice-table-header__show-filters">
        <a
          className="ice-table-header__show-filters-href ice-table-header__show-filters-href--disabled"
          onClick={resetFn}>
          {K_SHOW_FILTERS_TEXT}
        </a>
      </div>
    </div>
  );
}

export function renderMiniHeader(resetFn) {
  return (
    <div className="ice-table-header">
      <div className="ice-table-header__show-filters">
        <a
          className="ice-table-header__show-filters-href"
          onClick={resetFn}>
            {K_SHOW_FILTERS_TEXT}
          </a>
      </div>
    </div>
  );
}


function renderColumn0(cellDataKey, rowData /*, rowIndex*/) {
  return (
    <div className="ice-table__column0">
      <div className={cx('ice-table__column0-number', 'ice-table__column0-number__color' + rowData.get('type'))}>{rowData.get('number')}</div>
    </div>
  );
}

function renderColumn1(cellDataKey, rowData /*, rowIndex*/) {
  return (
    <div className="ice-table__column1">
      <div className="ice-table__column1-title">
        {rowData.get('title')}
      </div>
      <div className="ice-table__column1-address">
        {rowData.get('address')}
      </div>
    </div>
  );
}

function renderColumn2(cellDataKey, rowData /*, rowIndex*/) {
  // image load hack (just put in array with key eq to src (c) istarkov :-))
  return (
    <div className="ice-table__column2">
      {[<img key={rowData.get('image')} src={rowData.get('image')} style={K_STYLE_IMAGE} />]}
    </div>
  );
}

export function getRowClassNameAt(i, isHovered, isFirstInvisibleRow) {
  const borderTopClass = isFirstInvisibleRow ? K_ROW_CLASS_NAME_BORDER_LINE : '';

  if (isHovered) {
    return borderTopClass + ' ' + (i % 2 === 0 ? K_ROW_CLASS_NAME_EVEN_HOVERED : K_ROW_CLASS_NAME_ODD_HOVERED);
  }

  return borderTopClass + ' ' + (i % 2 === 0 ? K_ROW_CLASS_NAME_EVEN : K_ROW_CLASS_NAME_ODD);
}

export function cellRenderer(cellDataKey, rowData, rowIndex) {
  switch (cellDataKey) {
    case K_KEY_COLUMN_RANK:
      return renderColumn0(cellDataKey, rowData, rowIndex);
    case K_KEY_COLUMN_DESCRIPTION:
      return renderColumn1(cellDataKey, rowData, rowIndex);
    case K_KEY_COLUMN_PHONE:
      return renderColumn2(cellDataKey, rowData, rowIndex);
    default:
      return (
        <div>{rowData ? 'Hello world!' : ''}</div>
      );
  }
}

