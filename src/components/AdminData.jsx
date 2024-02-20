import React, { useRef, useState, useContext, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button as NextButton
} from "@nextui-org/react";
import Highlighter from "react-highlight-words";
import { collection, getDocs, onSnapshot, db } from "../db/index";
import { EyeOutlined } from "@ant-design/icons";
import User from "../context";

const AdminData = () => {
    const { login } = useContext(User);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [userData, setUserData] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedItems, setSelectedItems] = useState([]);
    const [modalTableData, setModalTableData] = useState([]); 
    const searchInput = useRef(null);
    const [scrollBehavior, setScrollBehavior] = React.useState("inside");
    useEffect(() => {
      getUserOrder();
    }, []);
    const getUserOrder = () => {
      
      const q = collection(db, "orders");
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const userOrderData = [];
        querySnapshot.forEach((doc) => {
          userOrderData.push({ key: doc.id, ...doc.data() });
        });
        setUserData(userOrderData);
      });
    };
  
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
    };
  
    const handleReset = (clearFilters) => {
      clearFilters();
      setSearchText("");
    };
    const showItemsModal = (items) => {
      setSelectedItems(items);
      
      const tableData = items.map((item, index) => ({
        key: index,
        name: item.title,
        quantity: item.qty,
        image: item.image,
        price: Math.round(item.price)
      }));
      setModalTableData(tableData);
      onOpen();
    };
  
    const getColumnSearchProps = (dataIndex) => ({
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
        close,
      }) => (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{
              marginBottom: 8,
              display: "block",
            }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{
                width: 90,
              }}
              className="bg-blue-500"
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{
                width: 90,
              }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({
                  closeDropdown: false,
                });
                setSearchText(selectedKeys[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Filter
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
              className="text-red-600 hover:text-red-600"
            >
              close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined
          style={{
            color: filtered ? "#1677ff" : undefined,
          }}
        />
      ),
      onFilter: (value, record) =>
        record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      render: (text, record) =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          text
        ),
    });
  
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        ...getColumnSearchProps("name"),
      },
      {
        title: "Items",
        dataIndex: "items",
        key: "items",
        render: (items) => (
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showItemsModal(items)}
          >
            View Items
          </Button>
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "address",
      },
      {
        title: " Amount",
        dataIndex: "totalAmount",
        key: "amount",
      },
      {
        title: "Address",
        dataIndex: "address",
        key: "address",
        ...getColumnSearchProps("address"),
        sorter: (a, b) => a.address.length - b.address.length,
        sortDirections: ["descend", "ascend"],
      },
    ];
    return (
      <>
        <Table
          columns={columns}
          dataSource={userData}
          className="mt-5 container mx-auto capitalize"
        />
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior={scrollBehavior} >
          <ModalContent style={{height:"50vh"}}> 
            {(onClose) => (
              <>
                <ModalHeader>Items Details</ModalHeader>
                <ModalBody>
                <ModalBody>
                <Table
                  columns={[
                    {
                      title: "Image",
                      dataIndex: "image",
                      key: "image",
                      render: (image) => (
                        <img
                          src={image}
                          alt="Item"
                          style={{ width: "50px", height: "50px" }}
                        />
                      ),
                    },
                    { title: "Name", dataIndex: "name", key: "name", },
                    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
                    { title: "Price", dataIndex: "price", key: "price" },
                  ]}
                  dataSource={modalTableData}
                />
              </ModalBody>
                </ModalBody>
                <ModalFooter>
                  <NextButton color="danger" variant="light" onPress={onClose}>
                    Close
                  </NextButton>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
}

export default AdminData
