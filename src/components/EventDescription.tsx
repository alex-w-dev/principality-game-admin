import React, { FC } from 'react';
import { EventType, IEvent } from '../stores/main-config.store';
import { ImageContainer } from './EventEditor/EventEditor';

type IProps = {
  event:IEvent
}

const EventDescription: FC<IProps> = (props: IProps) => {
  return <div>
    {/*<h4 dangerouslySetInnerHTML={{__html: this.state.currentEvent.title.ru}} />*/}
    <div>
      <b>Название задания:</b>
    </div>
    <div dangerouslySetInnerHTML={{__html: props.event.title.ru}} />
    <br/>
    <div>
      <b>Описание задания:</b>
    </div>
    <div dangerouslySetInnerHTML={{__html: props.event.text.ru}} />
    <br/>
    <div>
      <b>Тип события:</b>
    </div>
    <div hidden={props.event.type !== EventType.Common}>
      Сюжетное
    </div>
    <div hidden={props.event.type !== EventType.Random}>
      Случайное
    </div>
    <div hidden={props.event.type !== EventType.Critical}>
      Критическое
    </div>

    {props.event.imageUrl && <ImageContainer>
      <img src={props.event.imageUrl} alt=""/>
    </ImageContainer>}
  </div>
}

export default EventDescription;
