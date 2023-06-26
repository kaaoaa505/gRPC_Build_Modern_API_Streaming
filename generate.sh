protoc -I=. ./proto/*.proto \
--js_out=import_style=commonjs,binary:./build \
--grpc_out=./build \
--plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin`