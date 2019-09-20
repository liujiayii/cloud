import React from 'react'
import {
  Button, Card, Form, Row, Col, Input, Drawer, Descriptions, Spin, Upload, Icon, message,
} from 'antd'
import { connect } from 'dva'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import moment from 'moment'

const namespace = 'introduce'
const mapState = state => {
  const { listData, loading, search, drawerShow } = state[namespace]
  return { listData, loading, search, drawerShow }
}
const mapDispatch = dispatch => ({
  onDidMount: () => {
    dispatch({ type: `${namespace}/fetch` })
  },
  showDrawerAction: () => {
    dispatch({ type: `${namespace}/showDrawerAction` })
  },
  handleEdit: (record, that) => {
    dispatch({ type: `${namespace}/showDrawerAction` })
    const payload = { ...record }
    delete payload.time
    setTimeout(() => {
      that.props.form.setFieldsValue(payload)
      that.setState({ imageUrl: payload.qR_code })
    })
  },
  handleSubmit: (e, form) => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        const payload = {
          ...values,
          id: values.id || '',
          time: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
        dispatch({ type: `${namespace}/handleUpdate`, payload })
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

class Introduce extends React.Component {
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
      this.props.form.setFieldsValue({ qR_code: info.file.response.data })
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
      listData,
      handleEdit,
      form,
      form: { getFieldDecorator },
      showDrawerAction,
      drawerShow,
      handleSubmit,
      loading,
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
          <Button type="primary" onClick={() => handleEdit(listData, this)}>
            修改
          </Button>
          <Spin spinning={loading}>
            <Descriptions title="公司简介" layout="vertical" column={2}>
              <Descriptions.Item label="公司简介">{listData.content}</Descriptions.Item>
              <Descriptions.Item label="总裁寄语">{listData.wishes}</Descriptions.Item>
              <Descriptions.Item label="电子邮箱">{listData.e_mail}</Descriptions.Item>
              <Descriptions.Item label="联系QQ">{listData.qQ}</Descriptions.Item>
              <Descriptions.Item label="二维码"><img src={listData.qR_code} width="100" alt=""/></Descriptions.Item>
              <Descriptions.Item label="修改时间">
                {moment(listData.time).format('YYYY/MM/DD')}
              </Descriptions.Item>
            </Descriptions>
          </Spin>
        </Card>
        <Drawer
          title="公司简介"
          width={720}
          onClose={showDrawerAction}
          visible={drawerShow}
          destroyOnClose
        >
          <Form layout="vertical" hideRequiredMark>
            {getFieldDecorator('id')(<Input type="hidden"/>)}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="公司简介">
                  {getFieldDecorator('content', {
                    rules: [{ required: true, message: '请输入公司简介' }],
                  })(<Input.TextArea placeholder="请输入公司简介"/>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="总裁寄语">
                  {getFieldDecorator('wishes', {
                    rules: [{ required: true, message: '请输入总裁寄语' }],
                  })(<Input.TextArea placeholder="请输入总裁寄语"/>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="电子邮箱">
                  {getFieldDecorator('e_mail', {
                    rules: [{ required: true, message: '请输入电子邮箱' }],
                  })(<Input.TextArea placeholder="请输入电子邮箱"/>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="联系QQ">
                  {getFieldDecorator('qQ', {
                    rules: [{ required: true, message: '请输入联系QQ' }],
                  })(<Input.TextArea placeholder="请输入联系QQ"/>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="二维码">
                  {getFieldDecorator('qR_code')(<Input type="hidden"/>)}
                  <Upload
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="/news/uploadNewTrendImg"
                    beforeUpload={beforeUpload}
                    onChange={this.handleChange}
                    data={{ width: '100', height: '100' }}
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
            <Button onClick={event => handleSubmit(event, form)} type="primary">
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
)(Form.create({ name: 'introduce_form' })(Introduce))
