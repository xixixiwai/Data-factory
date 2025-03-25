import React, { PropsWithChildren } from 'react'

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}

const createForm :React.FC<PropsWithChildren<CreateFormProps>> = (props) => {
    const { modalVisible, onCancel } = props
  return (
    <div>
      <h1>createForm</h1>
    </div>
  )
}

export default createForm
