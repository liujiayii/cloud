import React from 'react'
import {
  Button, Card, Table, Form, Row, Col, Input, Switch, Drawer, Select, Modal, Upload,
  Icon,
  message,
} from 'antd'
import { connect } from 'dva'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import ProductForm from './product-form'

const namespace = 'brand-list'
const mapState = state => {
  const { tableData, pagination, loading, search, drawerShow } = state[namespace]
  return { tableData, pagination, loading, search, drawerShow }
}
const mapDispatch = dispatch => ({
  onDidMount: () => {
    dispatch({ type: `${namespace}/fetch` })
  },
  handleTableChange: (pagination, filters) => {
    const payload = { pageNum: pagination.current, ...filters }
    dispatch({ type: `${namespace}/fetch`, payload })
  },
  showDrawerAction: that => {
    dispatch({ type: `${namespace}/showDrawerAction` })
    if (that.state) {
      that.setState({ imageUrl: '', imageUrl2: '' })
    }
  },
  handleEdit: (record, that) => {
    dispatch({ type: `${namespace}/showDrawerAction` })
    const payload = { ...record }
    delete payload.products
    setTimeout(() => {
      that.props.form.setFieldsValue(payload)
      that.setState({ imageUrl: payload.img, imageUrl2: payload.details_img })
    })
  },
  handleDelete: (record, pagination) => {
    Modal.confirm({
      title: '删除',
      content: '是否删除该品牌？',
      onOk () {
        const payload = { id: record.id }
        dispatch({ type: `${namespace}/handleDelete`, payload, pagination })
      },
      onCancel () {},
    })
  },
  handleSubmit: (e, form, pagination) => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        const payload = { ...values, id: values.id || '' }
        dispatch({ type: `${namespace}/handleUpdate`, payload, pagination })
      }
    })
  },
  showDrawerActionProduct: () => {
    dispatch({ type: `${namespace}/showDrawerActionProduct` })
  },
  handleDeleteProduct: (record, pagination) => {
    Modal.confirm({
      title: '删除',
      content: '是否删除该产品？',
      onOk () {
        const payload = { id: record.id }
        dispatch({ type: `${namespace}/handleDeleteProduct`, payload, pagination })
      },
      onCancel () {},
    })
  },
  handleEditProduct: (record, that) => {
    dispatch({ type: `${namespace}/showDrawerActionProduct` })
    setTimeout(() => {
      that.child.props.form.setFieldsValue(record)
      that.child.setState({ imageUrl: record.img })
    })
  },
  changeStatus: (key, record, pagination) => {
    const payload = {
      id: record.id,
      [key]: [1, 0][record[key]],
    }
    dispatch({ type: `${namespace}/handleUpdateStatus`, payload, pagination })
  },
})

function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

function beforeUpload (file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('你只能上传 JPG/PNG 文件!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片必须小于 2MB!')
  }
  return isJpgOrPng && isLt2M
}

class BrandList extends React.Component {
  state = {
    loading: false,
    loading2: false,
  }

  componentDidMount () {
    this.props.onDidMount()
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true })
      return
    }
    if (info.file.status === 'done') {
      this.props.form.setFieldsValue({ img: info.file.response.data })
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      )
    }
  }

  handleChange2 = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading2: true })
      return
    }
    if (info.file.status === 'done') {
      this.props.form.setFieldsValue({ details_img: info.file.response.data })
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl2 =>
        this.setState({
          imageUrl2,
          loading2: false,
        }),
      )
    }
  }

  render () {
    const {
      tableData,
      pagination,
      loading,
      handleTableChange,
      handleEdit,
      handleDelete,
      form,
      form: { getFieldDecorator },
      search,
      showDrawerAction,
      drawerShow,
      handleSubmit,
      showDrawerActionProduct,
      handleDeleteProduct,
      handleEditProduct,
      changeStatus,
    } = this.props
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'}/>
        <div className="ant-upload-text">Upload</div>
      </div>
    )
    const uploadButton2 = (
      <div>
        <Icon type={this.state.loading2 ? 'loading' : 'plus'}/>
        <div className="ant-upload-text">Upload</div>
      </div>
    )
    const { imageUrl2, imageUrl } = this.state

    return (
      <PageHeaderWrapper>
        <Card>
          <Button type="primary" onClick={showDrawerAction}>
            新建品牌
          </Button>
          <Button type="primary" onClick={showDrawerActionProduct}>
            新建产品
          </Button>
          <Table
            dataSource={tableData}
            rowKey="id"
            pagination={pagination}
            loading={loading}
            bordered
            scroll={{ x: true }}
            expandedRowRender={record => (
              <Table dataSource={record.products} rowKey="id" pagination={false}>
                <Table.Column title="产品名称" dataIndex="name"/>
                <Table.Column title="产品介绍" dataIndex="introduce"/>
                <Table.Column
                  title="产品图片"
                  dataIndex="img"
                  render={text => <img src={text} width={100} alt=""/>}
                />
                <Table.Column
                  title="状态"
                  dataIndex="status"
                  render={text => (
                    <Switch checked={text === 1} checkedChildren="上架" unCheckedChildren="下架"/>
                  )}
                />
                <Table.Column title="排序" dataIndex="rank"/>
                <Table.Column
                  title="操作"
                  render={(text, records) => (
                    <div>
                      <Button type="primary" onClick={() => handleEditProduct(records, this)}>
                        查看
                      </Button>
                      <Button
                        type="danger"
                        onClick={() => handleDeleteProduct(records, pagination)}
                      >
                        删除
                      </Button>
                    </div>
                  )}
                />
              </Table>
            )}
            onChange={page => handleTableChange(page, search)}
          >
            <Table.Column title="品牌名称" dataIndex="name"/>
            <Table.Column title="品牌愿景" dataIndex="vision"/>
            <Table.Column title="品牌介绍" dataIndex="introduction"/>
            <Table.Column title="品牌发展" dataIndex="progress"/>
            <Table.Column
              title="详情图片"
              dataIndex="details_img"
              render={text => <img src={text} width={100} alt=""/>}
            />
            <Table.Column
              title="列表图片"
              dataIndex="img"
              render={text => <img src={text} width={100} alt=""/>}
            />
            <Table.Column title="排序" dataIndex="rank"/>
            <Table.Column
              title="状态"
              dataIndex="status"
              render={(text, record) => (
                <Switch
                  onChange={() => changeStatus('status', record, pagination)}
                  checked={text === 1}
                  checkedChildren="上架"
                  unCheckedChildren="下架"
                />
              )}
            />
            <Table.Column
              title="首页展示"
              dataIndex="home_page"
              render={(text, record) => (
                <Switch
                  onChange={() => changeStatus('home_page', record, pagination)}
                  checked={text === 1}
                  checkedChildren="上架"
                  unCheckedChildren="下架"
                />
              )}
            />
            <Table.Column
              title="操作"
              render={(text, record) => (
                <div>
                  <Button type="primary" onClick={() => handleEdit(record, this)}>
                    查看
                  </Button>
                  <Button type="danger" onClick={() => handleDelete(record, pagination)}>
                    删除
                  </Button>
                </div>
              )}
            />
          </Table>
        </Card>
        <Drawer
          title="品牌介绍"
          width={720}
          onClose={() => showDrawerAction(this)}
          visible={drawerShow}
          destroyOnClose
        >
          <Form layout="vertical" hideRequiredMark>
            {getFieldDecorator('id')(<Input type="hidden"/>)}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="品牌名称">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入品牌名称' }],
                  })(<Input placeholder="请输入品牌名称"/>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="品牌介绍">
                  {getFieldDecorator('introduction', {
                    rules: [{ required: true, message: '请输入品牌介绍' }],
                  })(<Input placeholder="请输入品牌介绍"/>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="品牌愿景">
                  {getFieldDecorator('vision', {
                    rules: [{ required: true, message: '请输入品牌愿景' }],
                  })(<Input placeholder="请输入品牌愿景"/>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="品牌发展">
                  {getFieldDecorator('progress', {
                    rules: [{ required: true, message: '请输入品牌发展' }],
                  })(<Input placeholder="请输入品牌发展"/>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="排序">
                  {getFieldDecorator('rank', {
                    rules: [{ required: true, message: '请输入排序' }],
                  })(<Input placeholder="请输入排序"/>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="状态">
                  {getFieldDecorator('status', {
                    rules: [{ required: true, message: '请选择状态' }],
                  })(
                    <Select placeholder="请选择状态">
                      <Select.Option value={0}>下架</Select.Option>
                      <Select.Option value={1}>上架</Select.Option>
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="首页展示">
                  {getFieldDecorator('home_page', {
                    rules: [{ required: true, message: '请选择状态' }],
                  })(
                    <Select placeholder="请选择状态">
                      <Select.Option value={0}>下架</Select.Option>
                      <Select.Option value={1}>上架</Select.Option>
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="详情图片">
                  {getFieldDecorator('details_img')(<Input type="hidden"/>)}
                  <Upload
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="/news/uploadNewTrendImg"
                    beforeUpload={beforeUpload}
                    onChange={this.handleChange2}
                    data={{ width: '500', height: '336' }}
                  >
                    {imageUrl2 ? <img src={imageUrl2} alt="avatar" style={{ width: '100%' }}/> : uploadButton2}
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="列表图片">
                  {getFieldDecorator('img')(<Input type="hidden"/>)}
                  <Upload
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="/news/uploadNewTrendImg"
                    beforeUpload={beforeUpload}
                    onChange={this.handleChange}
                    data={{ width: '600', height: '420' }}
                  >
                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }}/> : uploadButton}
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <div className="ant-drawer-footer">
            <Button onClick={showDrawerAction} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button onClick={event => handleSubmit(event, form, pagination)} type="primary">
              提交
            </Button>
          </div>
        </Drawer>
        <ProductForm
          onRef={ref => {
            this.child = ref
          }}
        />
      </PageHeaderWrapper>
    )
  }
}

export default connect(
  mapState,
  mapDispatch,
)(Form.create({ name: 'brand_form' })(BrandList))
