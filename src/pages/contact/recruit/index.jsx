import React from 'react';
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
} from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const namespace = 'recruit';
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
      content: '是否删除该招聘？',
      onOk() {
        const payload = { id: record.id };
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
            <Table.Column title="招聘岗位" dataIndex="position" />
            <Table.Column
              title="具体要求"
              dataIndex="remark"
              render={text => (
                <Typography.Paragraph style={{ maxWidth: '400px' }} ellipsis>
                  {text}
                </Typography.Paragraph>
              )}
            />
            <Table.Column title="招聘人数" dataIndex="count" />
            <Table.Column
              title="学历"
              dataIndex="education"
              render={text =>
                ['小学', '初中', '高中', '大专', '本科', '硕士研究生', '博士研究生'][text - 1]
              }
            />
            <Table.Column title="专业要求" dataIndex="major" />
            <Table.Column title="工作地点" dataIndex="workplace" />
            <Table.Column
              title="操作"
              render={(text, record) => (
                <div>
                  <Button type="primary" onClick={() => handleEdit(record, form)}>
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
          title="招聘发布"
          width={720}
          onClose={showDrawerAction}
          visible={drawerShow}
          destroyOnClose
        >
          <Form layout="vertical" hideRequiredMark>
            {getFieldDecorator('id')(<Input type="hidden" />)}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="招聘岗位">
                  {getFieldDecorator('position', {
                    rules: [{ required: true, message: '请输入招聘岗位' }],
                  })(<Input placeholder="请输入招聘岗位" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="招聘人数">
                  {getFieldDecorator('count', {
                    rules: [{ required: true, message: '请输入招聘人数' }],
                  })(<Input placeholder="请输入招聘人数" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="学历">
                  {getFieldDecorator('education', {
                    rules: [{ required: true, message: '请选择学历' }],
                  })(
                    <Select placeholder="请选择学历">
                      <Select.Option value={1}>小学</Select.Option>
                      <Select.Option value={2}>初中</Select.Option>
                      <Select.Option value={3}>高中</Select.Option>
                      <Select.Option value={4}>大专</Select.Option>
                      <Select.Option value={5}>本科</Select.Option>
                      <Select.Option value={6}>硕士研究生</Select.Option>
                      <Select.Option value={7}>博士研究生</Select.Option>
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="专业要求">
                  {getFieldDecorator('major', {
                    rules: [{ required: true, message: '请输入专业要求' }],
                  })(<Input placeholder="请输入专业要求" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="工作地点">
                  {getFieldDecorator('workplace', {
                    rules: [{ required: true, message: '请输入工作地点' }],
                  })(<Input placeholder="请输入工作地点" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="具体要求">
                  {getFieldDecorator('remark', {
                    rules: [{ required: true, message: '请输入具体要求' }],
                  })(<Input.TextArea placeholder="请输入具体要求" />)}
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
