import React from 'react'
import {
  Button,
  Card,
  Table,
  Form,
  Row,
  Col,
  Input,
  DatePicker,
  Switch,
  Drawer,
  Select,
  Modal,
  Upload,
  Icon,
  message,
  Typography,
} from 'antd'
import { connect } from 'dva'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import moment from 'moment'

const namespace = 'news'
const mapState = state => {
  const { tableData, pagination, loading, search, drawerShow, columnList } = state[namespace]
  return { tableData, pagination, loading, search, drawerShow, columnList }
}
const mapDispatch = dispatch => ({
  onDidMount: () => {
    dispatch({ type: `${namespace}/fetch` })
  },
  handleTableChange: (pagination, filters) => {
    const payload = { pageNum: pagination.current, ...filters }
    dispatch({ type: `${namespace}/fetch`, payload })
  },
  showDrawerAction: () => {
    dispatch({ type: `${namespace}/showDrawerAction` })
  },
  handleEdit: (record, that) => {
    dispatch({ type: `${namespace}/showDrawerAction` })
    const payload = {
      ...record,
      orderTime: moment(record.order_time),
    }
    delete payload.order_time
    setTimeout(() => {
      that.props.form.setFieldsValue(payload)
      that.setState({ imageUrl: payload.img })
    })
  },
  handleDelete: (record, pagination) => {
    Modal.confirm({
      title: '删除',
      content: '是否删除该品牌？',
      onOk () {
        const payload = { newsId: record.id }
        dispatch({ type: `${namespace}/handleDelete`, payload, pagination })
      },
      onCancel () {},
    })
  },
  handleSubmit: (e, form, pagination) => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        const payload = {
          ...values,
          id: values.id || '',
          orderTime: moment(values.orderTime).valueOf(),
        }
        dispatch({ type: `${namespace}/handleUpdate`, payload, pagination })
      }
    })
  },
  changeStatus: (record, pagination) => {
    const payload = {
      newsId: record.id,
      status: [1, 0][record.status],
    }
    dispatch({ type: `${namespace}/handleUpdateStatus`, payload, pagination })
  },
  changeDisplayStatus: (record, pagination) => {
    const payload = {
      newsId: record.id,
      first_show: [1, 0][record.first_show],
    }
    dispatch({ type: `${namespace}/changeDisplayStatus`, payload, pagination })
  },
  getAllColumn: () => {
    dispatch({ type: `${namespace}/getAllColumn` })
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
  }

  componentDidMount () {
    this.props.onDidMount()
    this.props.getAllColumn()
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
      changeStatus,
      changeDisplayStatus,
      columnList,
    } = this.props
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'}/>
        <div className="ant-upload-text">Upload</div>
      </div>
    )
    const { imageUrl } = this.state

    return (
      <PageHeaderWrapper>
        <Card>
          <Button type="primary" onClick={showDrawerAction}>
            新建新闻
          </Button>
          <Table
            dataSource={tableData}
            rowKey="id"
            pagination={pagination}
            loading={loading}
            bordered
            scroll={{ x: true }}
            onChange={page => handleTableChange(page, search)}
          >
            <Table.Column title="栏目主键" dataIndex="column_programa_id"/>
            <Table.Column title="标题" dataIndex="title"/>
            <Table.Column
              title="内容"
              dataIndex="content"
              render={text => (
                <Typography.Paragraph style={{ maxWidth: '400px' }} ellipsis>
                  {text}
                </Typography.Paragraph>
              )}
            />
            <Table.Column title="关键词" dataIndex="keyword"/>
            <Table.Column
              title="图片"
              dataIndex="img"
              render={text => <img src={text} width={100} alt=""/>}
            />
            <Table.Column
              title="状态"
              dataIndex="status"
              render={(text, record) => (
                <Switch
                  onChange={() => changeStatus(record, pagination)}
                  checked={text === 1}
                  checkedChildren="上架"
                  unCheckedChildren="下架"
                />
              )}
            />
            <Table.Column
              title="添加时间"
              dataIndex="time"
              render={text => moment(text).format('YYYY-MM-DD')}
            />
            <Table.Column
              title="首页展示"
              dataIndex="first_show"
              render={(text, record) => (
                <Switch
                  onChange={() => changeDisplayStatus(record, pagination)}
                  checked={text === 1}
                  checkedChildren="上架"
                  unCheckedChildren="下架"
                />
              )}
            />
            <Table.Column
              title="排序时间"
              dataIndex="order_time"
              render={text => moment(text).format('YYYY-MM-DD')}
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
          title="新闻动态"
          width={720}
          onClose={showDrawerAction}
          visible={drawerShow}
          destroyOnClose
        >
          <Form layout="vertical" hideRequiredMark>
            {getFieldDecorator('id')(<Input type="hidden"/>)}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="栏目主键">
                  {getFieldDecorator('column_programa_id', {
                    rules: [{ required: true, message: '请选择栏目' }],
                  })(
                    <Select placeholder="请选择栏目">
                      {columnList.map(item => (
                        <Select.Option value={item.id} key={item.id}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="关键词">
                  {getFieldDecorator('keyword', {
                    rules: [{ required: true, message: '请输入关键词' }],
                  })(<Input placeholder="请输入关键词"/>)}
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
                  {getFieldDecorator('first_show', {
                    rules: [{ required: true, message: '请选择首页展示状态' }],
                  })(
                    <Select placeholder="请选择首页展示状态">
                      <Select.Option value={0}>下架</Select.Option>
                      <Select.Option value={1}>上架</Select.Option>
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="排序时间">
                  {getFieldDecorator('orderTime', {
                    rules: [{ required: true, message: '请选择时间' }],
                  })(<DatePicker placeholder="请选择时间"/>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="标题">
                  {getFieldDecorator('title', {
                    rules: [{ required: true, message: '请输入标题' }],
                  })(<Input placeholder="请输入标题"/>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="内容">
                  {getFieldDecorator('content', {
                    rules: [{ required: true, message: '请输入内容' }],
                  })(<Input.TextArea placeholder="请输入内容"/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="图片">
                  {getFieldDecorator('img')(<Input type="hidden"/>)}
                  <Upload
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="/news/uploadNewTrendImg"
                    beforeUpload={beforeUpload}
                    onChange={this.handleChange}
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
      </PageHeaderWrapper>
    )
  }
}

export default connect(
  mapState,
  mapDispatch,
)(Form.create({ name: 'brand_form' })(BrandList))
