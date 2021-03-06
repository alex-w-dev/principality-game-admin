import React from 'react';
import { mainConfigStore } from '../../hooks/use-main-config-store';

export class ImportButton extends React.Component {

  fileChangeHandle(event) {
    event.preventDefault();

    if (!confirm("Вы пытаетесь загрузить новую конфигурацию, применить её вместо существующей?")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (_event: any) => {
      try {
        const obj = JSON.parse(_event.target.result);
        mainConfigStore.setMainConfig(obj);
      } catch (e) {
        console.error(e);
        alert(`Вы пытаетесь загрузить не валидный файл \nОшибка: \n${e.message}`);
      }
    };
    reader.readAsText(event.target.files[0]);
  }

  render() {
    return (
      <input type="file" onChange={this.fileChangeHandle} />
    );
  }
}
