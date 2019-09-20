import React from 'react'
import {
  Button,
  Card,
  Table,
  Form,
  Row,
  Col,
  Input,
  Drawer,
  Select,
  Modal,
  Typography,
  Upload,
  Icon,
  message,
} from 'antd'
import { connect } from 'dva'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import moment from 'moment'

const namespace = 'beauty'
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
      that.setState({ imageUrl: '' })
    }
  },
  handleEdit: (record, that) => {
    dispatch({ type: `${namespace}/showDrawerAction` })
    const payload = { ...record }
    setTimeout(() => {
      that.props.form.setFieldsValue(payload)
      that.setState({ imageUrl: payload.picurl })
    })
  },
  handleDelete: (record, pagination) => {
    Modal.confirm({
      title: '删除',
      content: '是否删除该风采？',
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
        const payload = {
          ...values,
          id: values.id || '',
          time: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
        dispatch({ type: `${namespace}/handleUpdate`, payload, pagination })
      }
    })
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

class Beauty extends React.Component {
  state = {
    loading: false,
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
      this.props.form.setFieldsValue({ picurl: info.file.response.data })
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
            新建
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
            <Table.Column title="编号ID" dataIndex="id"/>
            <Table.Column
              title="内容"
              dataIndex="content"
              render={text => (
                <Typography.Paragraph style={{ maxWidth: '400px' }} ellipsis>
                  {text}
                </Typography.Paragraph>
              )}
            />
            <Table.Column
              title="类型"
              dataIndex="type"
              render={text => (text === 1 ? '公司风采' : '员工风采')}
            />
            <Table.Column
              title="图片"
              dataIndex="picurl"
              render={text => <img src={text} width={100} alt=""/>}
            />
            <Table.Column
              title="添加时间"
              dataIndex="time"
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
          title="风采展示"
          width={720}
          onClose={() => showDrawerAction(this)}
          visible={drawerShow}
          destroyOnClose
        >
          <Form layout="vertical" hideRequiredMark>
            {getFieldDecorator('id')(<Input type="hidden"/>)}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="类型">
                  {getFieldDecorator('type', {
                    rules: [{ required: true, message: '请选择类型' }],
                  })(
                    <Select placeholder="请选择类型">
                      <Select.Option value={1}>公司风采</Select.Option>
                      <Select.Option value={2}>员工风采</Select.Option>
                    </Select>,
                  )}
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
                  {getFieldDecorator('picurl')(<Input type="hidden"/>)}
                  <Upload
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="/news/uploadNewTrendImg"
                    beforeUpload={beforeUpload}
                    onChange={this.handleChange}
                    data={{ width: '500', height: '278' }}
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
)(Form.create({ name: 'brand_form' })(Beauty))
