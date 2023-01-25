import { ExportToCsv } from 'export-to-csv';
import { loadState } from "../utils/localStorage";
import { BASE_URL } from "../actions/types";
import { postRequest, getRequest } from "./apiService";
import {isEmpty} from "lodash";

const getTransactionStatus = (transaction) => {
    try {
        let status = 'APPROVED';
        if (transaction.transType !== 'PREAUTH') {
            if (transaction.refundList && transaction.refundList.length > 0) {
                status = 'REFUNDED'
            }
            else if (
                (transaction.gatewayResponseMessage === "APPROVED" ||
                    transaction.gatewayResponseMessage === "Successful") &&
                (transaction.gatewayResponseCode === "00") &&
                (transaction.status === "COMPLETED" || transaction.status === "SETTLED")
            ) {

            }
        } else {
            status =
                (transaction.preAuthType &&
                    transaction.preAuthType.replace("_", " ").toUpperCase()) ||
                "";
        }
        return status;
    } catch (e) {
        return 'APPROVED'
    }
}
const exportSettlementReport = async (data) => {
    var transformed_data = [];
    var refundFeeTotal = 0;
    var transactionFeeTotal = 0;
    var transferTotal = 0;
    var refundTotal = 0;
    var transactionTotal = 0;
    await data.map(res => {
        transformed_data.push(
            {
                Status: res.paymentStatus ? res.paymentStatus : 'NA',
                Date: res.transferDate ? res.transferDate : 'NA',
                Reference: res.cycleRef ? res.cycleRef : 'NA',
                Currency: res.settlementcurrency ? res.settlementcurrency : 'NA',
                "Original Amount": res.originalAmount ? res.originalAmount : 0,
                "Settlement Amount": res.settlementAmount ? res.settlementAmount : 0,
                Fee: res.Fee ? res.Fee : 0,
                'Refund Amount': res.refundVolume ? res.refundVolume : 0,
                'Refund Fee': res.refundFee ? res.refundFee : 0,
                "Transaction Count": res.transactionCount ? res.transactionCount : '0',
                "Refund Count": res.refundCount ? res.refundCount : '0',
                "Refund Volume": res.refundVolume ? res.refundVolume : '0',
                "Transfer Date": res.transferDate ? res.transferDate : '0',
                "Description": res.payoutIdentifier ? res.payoutIdentifier : 'NA',
            }
        )
        refundTotal += res.refundFee && res.refundVolume ? Number.parseFloat(res.refundFee + res.refundVolume) : 0
        refundFeeTotal += res.refundFee ? Number.parseFloat(res.refundFee) : 0
        transactionTotal += res.originalAmount ? Number.parseFloat(res.originalAmount) : 0
        transactionFeeTotal += res.Fee ? Number.parseFloat(res.Fee) : 0
        transferTotal += res.settlementAmount ? Number.parseFloat(res.settlementAmount) : 0

    });
    transformed_data.push(
        {
            Status: `Totals \n | Refunded: ${refundTotal}\n | Refund Fee: ${refundFeeTotal} \n | Transactions: ${transactionTotal}\n | Transaction Fee: ${transactionFeeTotal}\n | Transferred: ${transferTotal}`,
            Date: '',
            Reference: '',
            Currency: '',
            "Original Amount": '',
            "Settlement Amount": '',
            Fee: '',
            'Refund Amount': '',
            'Refund Fee': '',
            "Transaction Count": '',
            "Refund Count": '',
            "Refund Volume": '',
            "Transfer Date": '',
            "Description": '',
        }
    )
    try {

        const options = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalSeparator: '.',
            showLabels: false,
            showTitle: true,
            title: 'seerbit-settlement-report',
            filename: 'seerbit-settlement-report',
            useTextFile: false,
            useBom: true,
            useKeysAsHeaders: true,
        };
        const csvExporter = new ExportToCsv(options);
        csvExporter.generateCsv(transformed_data);
        return true
    } catch (e) {
        throw Error(e.message)
    }
}
const exportTransactionsReport = async (data) => {
    var transformed_data = [];
    await data.map(res => {
        transformed_data.push(
            {
                gatewayResponseCode: res.gatewayResponseCode ? res.gatewayResponseCode : 'NA',
                Status: getTransactionStatus(res),
                Time: res.transactionTimeString ? res.transactionTimeString : 'NA',
                Currency: res.currency ? res.currency : 'NA',
                "Transaction Amount": res.amount ? getTransactionStatus(res) === 'REFUNDED' ? res.amount : res.amount : 0,
                "Settlement Amount": res.settlementAmount ? getTransactionStatus(res) === 'REFUNDED' ? res.amount : res.settlementAmount : 0,
                "Transaction Fee": res.transactionFee ? getTransactionStatus(res) === 'REFUNDED' ? 0 : res.transactionFee : 0,
                "Linking Reference": res.linkingRef ? res.linkingRef : 'NA',
                "Transaction Reference": res.transactionRef ? res.transactionRef : 'NA',
                Description: res.transactionDescription ? res.transactionDescription : "NA",
                "Customer": res.customer ? res.customer.customerName ? res.customer.customerName : "NA" : "NA",
                "Customer Phone": res.customer ? res.customer.customerPhone ? res.customer.customerPhone : "NA" : "NA",
                "Customer Email": res.customer ? res.customer.customerEmail ? res.customer.customerEmail : "NA" : "NA",
                Fee: res.productId ? res.productId : 0,
                Country: res.analytics ? res.analytics.country ? res.analytics.country : "NA" : "NA",
                Bank: res.analytics ? res.analytics.bank ? res.analytics.bank : "NA" : "NA",
                Channel: res.analytics ? res.analytics.channel ? res.analytics.channel : "NA" : "NA",
                "Channel Type": res.analytics ? res.analytics.channelType ? res.analytics.channelType : "NA" : "NA",
                gatewayResponseMessage: res.gatewayResponseMessage ? res.gatewayResponseMessage : 'NA',
            }
        )
    });

    try {

        const options = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalSeparator: '.',
            showLabels: true,
            showTitle: false,
            title: 'seerbit-settlement-transactions-report',
            filename: 'seerbit-settlement-transactions-report',
            useTextFile: false,
            useBom: true,
            useKeysAsHeaders: true,
        };
        const csvExporter = new ExportToCsv(options);
        csvExporter.generateCsv(transformed_data);
        return true
    } catch (e) {
        throw Error(e.message)
    }
}
const getSettlementsRefunds = async (cycleRef,type) => {
    const state = loadState() && loadState().user.data;
    return getRequest(`${BASE_URL}user/${state.business_details.number}/refunds/settlement/${cycleRef}/transactions?type=${type}`)
}
const exportRefundsReport = async (data) => {
    var transformed_data = [];
    await data.map(res => {
        transformed_data.push(
            {
                Amount: !isEmpty(res.refundList) && Array.isArray(isEmpty(res.refundList)) ? res.refundList.length ? res.refundList[0].amount : res.amount : res.amount,
                Beneficiary: res.customer ? res.customer.customerName : 'NA',
                Date: res.created_at ? res.created_at : 'NA',
                "Linking Reference": res.transactionRef ? res.transactionRef : 'NA',
                "Transaction Reference": res.transactionRef ? res.transactionRef : 'NA'
            }
        )
    });
    try {
        const options = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalSeparator: '.',
            showLabels: true,
            showTitle: false,
            title: 'seerbit-settlement-refunds-report',
            filename: 'seerbit-settlement-refunds-report',
            useTextFile: false,
            useBom: true,
            useKeysAsHeaders: true,
        };
        const csvExporter = new ExportToCsv(options);
        csvExporter.generateCsv(transformed_data);
        return true
    } catch (e) {
        throw Error(e.message)
    }
}

const emailSettlementReport = (data,status)=>{
    const state = loadState() && loadState().user.data;
    const url = `transaction/${state.business_details.number}/sendreport/link?transactionType=${status}`
    return postRequest(`${BASE_URL}${url}`, data)
}
export { exportSettlementReport, exportTransactionsReport, exportRefundsReport, getSettlementsRefunds, emailSettlementReport }
