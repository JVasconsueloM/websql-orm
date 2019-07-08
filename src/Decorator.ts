import { ColumnType } from "./ColumnType";
import { ColumnInfo } from "./ColumnInfo";
import { ReferenceInfo } from "./ReferenceInfo";
import { Table } from "./Table";

/**
 * 用于定义列的装饰器
 */
export function column(type: ColumnType) {
    return function (target: any, name: string) {
        let _column: ColumnInfo = {
            name: name,
            type: type
        }
        let _target = target.constructor;
        if (!_target["__columns__"]) {
            _target["__columns__"] = new Array<ColumnInfo>();
        }
        _target["__columns__"].push(_column);
    }
}


/**
 * 用于定义表的装饰器
 */
export function table(dbName: string = null) {

    console.warn(`@table is about to be deprecated, please use @database(dbName) decorator instead. \r\n @table 即将废弃，请改用 @database(dbName) 装饰器`)
    // if (dbName != null) {
    //     throw `@table only supports defining tables in later versions, no parameters are passed in. Please add @database(dbName) decorator. 
    //            @table 在以后的版本中只支持定义表，不支持传入参数，请添加 @database(dbName) 装饰器`;
    // }

    return function (target: any) {
        target["__db_name__"] = dbName;
        target["__table_name__"] = target.name;
    };
}
/**
 * 用于定义表所在的数据库
 */
export function database(dbName: string, tableName: string) {
    return function (target: any) {
        target["__db_name__"] = dbName;
        target["__table_name__"] = tableName; //target.name;
    };
}


/**
 * 定义外键引用的装饰器
 * @param keyName 字段名
 * @param refTableName 引用的表名
 * @param refKeyName 引用的表的字段名
 */
export function reference<T extends Table>(keyName: string, refTableInstance: T, refKeyName: string, filter: (m: T) => void = null) {
    return function (target: any, name: string) {
        let _reference: ReferenceInfo = {
            refTableInstance: refTableInstance,
            refKeyName: refKeyName,
            foreignKeyName: keyName,
            propertyName: name,
            filter: filter
        }
        let _target = target.constructor;
        if (!_target["__references__"]) {
            _target["__references__"] = new Array<ReferenceInfo>();
        }
        _target["__references__"].push(_reference);
    }
}

