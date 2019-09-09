import React from 'react';
import { Button, Card, Table, Form, Row, Col, Input, Drawer, Modal, Typography } from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';

const namespace = 'mall';
const mapState = state => {
  const { tableData, pagination, loading, search, drawerShow } = state[namespace];
  return { tableData, pagination, loading, search, drawerShow };
};
const mapDispatch = dispatch => ({
  onDidMount: () => {
    dispatch({ type: `${namespace}/fetch` });
  },
  handleTableChange: (pagination, filters) => {
    const payload = { pageNum: pagination.current, ...filters };
    dispatch({ type: `${namespace}/fetch`, payload });
  },
  showDrawerAction: () => {
    dispatch({ type: `${namespace}/showDrawerAction` });
  },
  handleEdit: (record, form) => {
    dispatch({ type: `${namespace}/showDrawerAction` });
    const payload = { ...record };
    setTimeout(() => {
      form.setFieldsValue(payload);
    });
  },
  handleDelete: (record, pagination) => {
    Modal.confirm({
      title: '删除',
      content: '是否删除该品牌？',
      onOk() {
        const payload = { newsId: record.id };
        dispatch({ type: `${namespace}/handleDelete`, payload, pagination });
      },
      onCancel() {},
    });
  },
  handleSubmit: (e, form, pagination) => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        const payload = {
          ...values,
          id: values.id || '',
          time: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
        dispatch({ type: `${namespace}/handleUpdate`, payload, pagination });
      }
    });
  },
});

class BrandList extends React.Component {
  componentDidMount() {
    this.props.onDidMount();
  }

  render() {
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
    } = this.props;

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
            <Table.Column title="商城名称" dataIndex="title" />
            <Table.Column
              title="商城介绍"
              dataIndex="content"
              render={text => (
                <Typography.Paragraph style={{ maxWidth: '400px' }} ellipsis>
                  {text}
                </Typography.Paragraph>
              )}
            />
            <Table.Column
              title="业务范围"
              dataIndex="line_busiess"
              render={text => (
                <Typography.Paragraph style={{ maxWidth: '400px' }} ellipsis>
                  {text}
                </Typography.Paragraph>
              )}
            />
            <Table.Column
              title="时间"
              dataIndex="time"
              render={text => moment(text).format('YYYY-MM-DD')}
            />
            <Table.Column
              title="操作"
              render={(text, record) => (
                <div>
                  <Button type="primary" onClick={() => handleEdit(record, form)}>
                    查看
                  </Button>
                  <Button disabled type="danger" onClick={() => handleDelete(record, pagination)}>
                    删除
                  </Button>
                </div>
              )}
            />
          </Table>
        </Card>
        <Drawer
          title="商城介绍"
          width={720}
          onClose={showDrawerAction}
          visible={drawerShow}
          destroyOnClose
        >
          <Form layout="vertical" hideRequiredMark>
            {getFieldDecorator('id')(<Input type="hidden" />)}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="商城名称">
                  {getFieldDecorator('title', {
                    rules: [{ required: true, message: '请输入商城名称' }],
                  })(<Input placeholder="请输入商城名称" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="商城介绍">
                  {getFieldDecorator('content', {
                    rules: [{ required: true, message: '请输入商城介绍' }],
                  })(<Input.TextArea placeholder="请输入商城介绍" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="业务范围">
                  {getFieldDecorator('line_busiess', {
                    rules: [{ required: true, message: '请输入业务范围' }],
                  })(<Input.TextArea placeholder="请输入业务范围" />)}
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
    );
  }
}

export default connect(
  mapState,
  mapDispatch,
)(Form.create({ name: 'brand_form' })(BrandList));
