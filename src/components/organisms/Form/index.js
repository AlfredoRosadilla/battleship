import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const minHeightByInput = css`
  min-height: 40px;
`;

const FormElement = styled.form`
  width: 100%;
`;

const Table = styled.div`
  display: flex;
  width: 100%;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column; /* Esto asegura que los elementos hijos (rows) se apilen verticalmente */
  height: 100%; /* Ocupa todo el alto disponible */
  width: 100%; /* Ocupa todo el ancho disponible */
`;

const Row = styled.div`
  flex: 1; /* Esto hará que cada 'row' se expanda para ocupar el espacio disponible, dividiendo el espacio por igual entre las filas */
  margin: 5px 0; /* Espacio entre las entradas */
  ${minHeightByInput}
`;

const Input = styled.input`
  width: 100%; /* Hace que los elementos de entrada ocupen todo el ancho del contenedor */
  box-sizing: border-box; /* Esto asegura que el padding y el border del input no sumen al ancho total, evitando desbordamientos */
  padding: 5px;
  ${minHeightByInput}
`;

const TextArea = styled.textarea`
  width: 100%; /* Hace que los elementos de entrada ocupen todo el ancho del contenedor */
  box-sizing: border-box; /* Esto asegura que el padding y el border del input no sumen al ancho total, evitando desbordamientos */
  padding: 5px;
  ${minHeightByInput}
`;

const Button = styled.button`
  margin-top: 15px; /* Espacio entre el último input y el botón */
  padding: 10px 15px;
`;

export function InputDataModel(name, column, row, type, placeholder) {
  this.row = row;
  this.name = name;
  this.type = type;
  this.column = column;
  this.placeholder = placeholder;
}

/**
 * Form
 * @param {props} props
 * @returns Form component instance
 */
function Form({
  testId,
  className,

  children,

  inputs,
  isDisabled,
  buttonText,

  onSubmit,
}) {
  const methods = Object.assign(new Methods(), {
    testId,

    inputs,
    onSubmit,
  });

  return (
    <FormElement onSubmit={(event) => methods.internalOnSubmit(event)}>
      <Table className={className}>{methods.getInputs(inputs)}</Table>

      {children}

      {buttonText && (
        <Button type="submit" disabled={isDisabled}>
          {buttonText}
        </Button>
      )}
    </FormElement>
  );
}

/**
 * Controller
 */
export function Methods() {}

Methods.prototype.createMatrix = function createMatrix(inputs, matrix) {
  return new Array(matrix.totalColumns).fill([]).map((_, index) => {
    let rowsMatrix = new Array(matrix.totalRows).fill(null);
    const inputRows = inputs.filter(
      ({ column }) => column === index + matrix.minColumn,
    );

    inputRows.forEach((inputRow) => {
      rowsMatrix[inputRow.row - matrix.minRow] = inputRow;
    });

    return rowsMatrix;
  });
};

Methods.prototype.internalOnSubmit = function internalOnSubmit(event) {
  event.preventDefault();

  // Crear un objeto FormData del formulario
  const formData = new FormData(event.target);

  // Convertir los datos del formulario en un objeto
  const formValues = {};
  formData.forEach((value, key) => {
    formValues[key] = value;
  });

  return this.onSubmit(formValues);
};

/**
 * Returns the paginator page tiles controlers
 * @returns {JSX} page tiles
 */
Methods.prototype.getInputs = function getInputs() {
  const { inputs = [] } = this;
  const { minRow, maxRow, maxColumn, minColumn } = inputs.reduce(
    function (previous, { column, row }) {
      return {
        minRow: previous.minRow < row ? previous.minRow : row,
        maxRow: previous.maxRow > row ? previous.maxRow : row,
        minColumn: previous.minColumn < column ? previous.minColumn : column,
        maxColumn: previous.maxColumns > column ? previous.maxColumns : column,
      };
    },
    {
      minRow: Infinity,
      maxRow: -Infinity,
      maxColumn: -Infinity,
      minColumn: Infinity,
    },
  );
  const totalRows = maxRow - minRow + 1;
  const totalColumns = maxColumn - minColumn + 1;
  const columnsMatrix = this.createMatrix(inputs, {
    minRow,
    maxRow,
    totalRows,
    minColumn,
    maxColumn,
    totalColumns,
  });

  return columnsMatrix.map((inputColumn, index) => (
    <Column key={`column-${index}`}>
      {inputColumn.map((inputRow, index2) => (
        <Row key={`row-${index2}`}>
          {inputRow &&
            (inputRow.type === 'text-area' ? (
              <TextArea
                name={inputRow.name}
                placeholder={inputRow.placeholder}
              ></TextArea>
            ) : (
              <Input
                name={inputRow.name}
                type={inputRow.type}
                placeholder={inputRow.placeholder}
              />
            ))}
        </Row>
      ))}
    </Column>
  ));
};

Form.propTypes = {
  children: PropTypes.element,

  testId: PropTypes.string.isRequired,
  inputs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      row: PropTypes.number,
      column: PropTypes.number,
      type: PropTypes.string,
    }),
  ).isRequired,
  buttonText: PropTypes.string,

  onSubmit: PropTypes.func,

  className: PropTypes.string,
};

export default Form;
