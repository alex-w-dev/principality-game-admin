import React, { FC } from 'react';

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
        <td>{variableCode}</td>
        <td>{value}</td>
      </tr>
    })}
    </tbody>
  </table>
}

export default VariableStateTable;
