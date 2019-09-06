import React from 'react'
import { Button, Card, Form, Modal, Tabs, Descriptions, Input } from 'antd'
import { connect } from 'dva'
import { PageHeaderWrapper } from '@ant-design/pro-layout'

const namespace = 'login'
const mapState = () => {}
const mapDispatch = dispatch => ({
  handleSubmit: (e, form) => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        Modal.confirm({
          title: '修改密码',
          content: `是否将您的密码修改为 ${values.password} ?`,
          onOk () {
            const payload = {
              id: JSON.parse(window.sessionStorage.getItem('userInfo')).id,
              password: values.password,
            }
            dispatch({ type: `${namespace}/handleUpdatePassword`, payload })
            form.resetFields()
          },
          onCancel () {},
        })
      }
    })
  },
})

class BrandList extends React.Component {
  state = {
    confirmDirty: false,
  }

  handleConfirmBlur = e => {
    const { value } = e.target
    this.setState(prev => ({ confirmDirty: prev.confirmDirty || !!value }))
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props
    if (value && value !== form.getFieldValue('password')) {
      callback('您输入的两个密码不一致!')
    } else {
      callback()
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  render () {
    const {
      form,
      form: { getFieldDecorator },
      handleSubmit,
    } = this.props

    return (
      <PageHeaderWrapper>
        <Card>
          <Tabs tabPosition="left">
            <Tabs.TabPane tab="基本资料" key="1">
              <Descriptions title="User Info">
                <Descriptions.Item label="UserName">Zhou Maomao</Descriptions.Item>
                <Descriptions.Item label="Telephone">1810000000</Descriptions.Item>
                <Descriptions.Item label="Live">Hangzhou, Zhejiang</Descriptions.Item>
                <Descriptions.Item label="Remark">empty</Descriptions.Item>
                <Descriptions.Item label="Address">
                  No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
                </Descriptions.Item>
              </Descriptions>
            </Tabs.TabPane>
            <Tabs.TabPane tab="安全设置" key="2">
              <Form layout="inline" hideRequiredMark>
                <Form.Item label="密码" hasFeedback>
                  {getFieldDecorator('password', {
                    rules: [
                      { required: true, message: '请输入您的密码!' },
                      { validator: this.validateToNextPassword },
                    ],
                  })(<Input.Password/>)}
                </Form.Item>
                <Form.Item label="确认密码" hasFeedback>
                  {getFieldDecorator('confirm', {
                    rules: [
                      { required: true, message: '请确认您的密码!' },
                      { validator: this.compareToFirstPassword },
                    ],
                  })(<Input.Password onBlur={this.handleConfirmBlur}/>)}
                </Form.Item>
                <Button onClick={event => handleSubmit(event, form)} type="primary">
                  提交
                </Button>
              </Form>
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default connect(
  mapState,
  mapDispatch,
)(Form.create({ name: 'brand_form' })(BrandList))
