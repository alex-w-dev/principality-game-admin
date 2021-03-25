import React from 'react';
import {
  SortableContainer as sortableContainer,
  SortableElement as sortableElement,
  SortableHandle as sortableHandle,
} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import styles from './SortableList.module.scss';

const DragHandle = sortableHandle(() => <div
  className={styles.dragHandler}
>::</div>);

const SortableItem = sortableElement(({children}) => (
  <li className={styles.listItem}>
    <DragHandle />
    <div style={{
      flexGrow: 1,
      display: 'flex',
      alignItems: 'center',
    }}>{children}</div>
  </li>
));

const SortableContainer = sortableContainer(({children}) => {
  return <ul
    style={{
      padding: 0,
    }}
  >{children}</ul>;
});

interface Props {
  items: any[];
  onNewList(sorted: any[]): void;
  renderItem(item: any, index: number): JSX.Element
}

export default function SortableList (props: Props) {
  const items = props.items

  const onSortEnd = ({oldIndex, newIndex}) => {
    props.onNewList(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <SortableContainer onSortEnd={onSortEnd} useDragHandle>
      {items.map((item, index) => (
        <SortableItem key={`item-${index}`} index={index} >
          {props.renderItem(item, index)}
        </SortableItem>
      ))}
    </SortableContainer>
  );
}
