import React, { FC } from 'react';
import { variableCodeToTitle } from '../utils/variable-code-to-title';

type IProps = {
  variables: {[code: string]: number}
}

const VariableStateTable: FC<IProps> = (props: IProps) => {
  return <table>
    <tbody>
    {Object.entries(props.variables).map(([variableCode, value]) => {
      return <tr
        key={variableCode}
      >
        <td>{variableCodeToTitle(variableCode)}</td>
        <td>{value}</td>
      </tr>
    })}
    </tbody>
  </table>
}

export default VariableStateTable;
