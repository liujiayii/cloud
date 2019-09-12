import React from 'react'
import {
  Button, Form, Row, Col, Input, Drawer, Select, Upload,
  Icon,
  message,
} from 'antd'
import { connect } from 'dva'

const namespace = 'brand-list'
const mapState = state => {
  const { drawerShowProduct, brandList, pagination } = state[namespace]
  return { drawerShowProduct, brandList, pagination }
}
const mapDispatch = dispatch => ({
  handleSubmit: (e, form, pagination) => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        const payload = { ...values, id: values.id || '' }
        dispatch({ type: `${namespace}/handleUpdateProduct`, payload, pagination })
      }
    })
  },
  showDrawerActionProduct: () => {
    dispatch({ type: `${namespace}/showDrawerActionProduct` })
  },
  getBrandList: () => {
    dispatch({ type: `${namespace}/getBrandList` })
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
class ProductForm extends React.PureComponent {
  state = {
    loading: false,
  }
  componentDidMount () {
    this.props.getBrandList()
    this.props.onRef(this)
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
      pagination,
      form,
      form: { getFieldDecorator },
      drawerShowProduct,
      handleSubmit,
      showDrawerActionProduct,
      brandList,
    } = this.props
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'}/>
        <div className="ant-upload-text">Upload</div>
      </div>
    )
    const { imageUrl } = this.state
    return (
      <Drawer
        title="产品介绍"
        width={720}
        onClose={showDrawerActionProduct}
        visible={drawerShowProduct}
        destroyOnClose
      >
        <Form layout="vertical" hideRequiredMark>
          {getFieldDecorator('id')(<Input type="hidden"/>)}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="产品名称">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入产品名称' }],
                })(<Input placeholder="请输入产品名称"/>)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="产品介绍">
                {getFieldDecorator('introduce', {
                  rules: [{ required: true, message: '请输入产品介绍' }],
                })(<Input placeholder="请输入产品介绍"/>)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="品牌">
                {getFieldDecorator('brand_id', {
                  rules: [{ required: true, message: '请选择品牌' }],
                })(
                  <Select placeholder="请选择品牌">
                    {brandList.map(item => (
                      <Select.Option value={item.id} key={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
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
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="详情图片">
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
          <Button onClick={showDrawerActionProduct} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button onClick={event => handleSubmit(event, form, pagination)} type="primary">
            提交
          </Button>
        </div>
      </Drawer>
    )
  }
}

export default connect(
  mapState,
  mapDispatch,
)(Form.create({ name: 'product_form' })(ProductForm))
