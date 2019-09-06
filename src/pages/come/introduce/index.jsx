import React from 'react';
import {
  Button,
  Card,
  Form,
  Row,
  Col,
  Input,
  Drawer,
  Descriptions,
  Spin,
} from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';

const namespace = 'introduce';
const mapState = state => {
  const { listData, loading, search, drawerShow } = state[namespace];
  return { listData, loading, search, drawerShow };
};
const mapDispatch = dispatch => ({
  onDidMount: () => {
    dispatch({ type: `${namespace}/fetch` });
  },
  showDrawerAction: () => {
    dispatch({ type: `${namespace}/showDrawerAction` });
  },
  handleEdit: (record, form) => {
    dispatch({ type: `${namespace}/showDrawerAction` });
    const payload = { ...record };
    delete payload.time;
    setTimeout(() => {
      form.setFieldsValue(payload);
    });
  },
  handleSubmit: (e, form) => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        const payload = {
          ...values,
          id: values.id || '',
          time: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
        dispatch({ type: `${namespace}/handleUpdate`, payload });
      }
    });
  },
});

class Introduce extends React.Component {
  componentDidMount() {
    this.props.onDidMount();
  }

  render() {
    const {
      listData,
      handleEdit,
      form,
      form: { getFieldDecorator },
      showDrawerAction,
      drawerShow,
      handleSubmit,
      loading,
    } = this.props;

    return (
      <PageHeaderWrapper>
        <Card>
          <Button type="primary" onClick={() => handleEdit(listData, form)}>
            修改
          </Button>
          <Spin spinning={loading}>
            <Descriptions title="公司简介" layout="vertical">
              <Descriptions.Item label="修改时间">
                {moment(listData.time).format('YYYY/MM/DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="公司简介">{listData.content}</Descriptions.Item>
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
            {getFieldDecorator('id')(<Input type="hidden" />)}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="公司简介">
                  {getFieldDecorator('content', {
                    rules: [{ required: true, message: '请输入公司简介' }],
                  })(<Input.TextArea placeholder="请输入公司简介" />)}
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
    );
  }
}

export default connect(
  mapState,
  mapDispatch,
)(Form.create({ name: 'introduce_form' })(Introduce));
