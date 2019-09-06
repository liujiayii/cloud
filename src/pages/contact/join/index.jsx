import React from 'react';
import { Button, Card, Table, Form, Modal } from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';

const namespace = 'join';
const mapState = state => {
  const { tableData, pagination, loading, search } = state[namespace];
  return { tableData, pagination, loading, search };
};
const mapDispatch = dispatch => ({
  onDidMount: () => {
    dispatch({ type: `${namespace}/fetch` });
  },
  handleTableChange: (pagination, filters) => {
    const payload = { pageNum: pagination.current, ...filters };
    dispatch({ type: `${namespace}/fetch`, payload });
  },
  handleDelete: (record, pagination) => {
    Modal.confirm({
      title: '删除',
      content: '是否删除该招商？',
      onOk() {
        const payload = { newsId: record.id };
        dispatch({ type: `${namespace}/handleDelete`, payload, pagination });
      },
      onCancel() {},
    });
  },
});

class BrandList extends React.Component {
  componentDidMount() {
    this.props.onDidMount();
  }

  render() {
    const { tableData, pagination, loading, handleTableChange, handleDelete, search } = this.props;

    return (
      <PageHeaderWrapper>
        <Card>
          <Table
            dataSource={tableData}
            rowKey="id"
            pagination={pagination}
            loading={loading}
            bordered
            scroll={{ x: true }}
            onChange={page => handleTableChange(page, search)}
          >
            <Table.Column title="姓氏" dataIndex="family_name" />
            <Table.Column title="性别" dataIndex="sex" />
            <Table.Column title="联系方式" dataIndex="phone" />
            <Table.Column
              title="添加时间"
              dataIndex="time"
              render={text => moment(text).format('YYYY-MM-DD')}
            />
            <Table.Column
              title="操作"
              render={(text, record) => (
                <div>
                  <Button type="danger" onClick={() => handleDelete(record, pagination)}>
                    删除
                  </Button>
                </div>
              )}
            />
          </Table>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(
  mapState,
  mapDispatch,
)(Form.create({ name: 'brand_form' })(BrandList));
