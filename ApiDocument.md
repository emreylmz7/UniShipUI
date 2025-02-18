# UniShip API Documentation

This document provides detailed information about the UniShip API endpoints, their request/response structures, and examples.

## Base URL

```
https://localhost:7206/
```

## Authentication

All API requests require authentication using JWT (JSON Web Token). Include the token in the Authorization header:

```
Authorization: Bearer {your_jwt_token}
```

## Authentication Endpoints

### Login

```http
POST /auth/login
```

Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "isSuccessful": true,
  "data": {
    "token": "string",
    "expiration": "2024-03-21T12:00:00Z"
  }
}
```

## Branch Endpoints

### Create Branch

```http
POST /branchs
```

Creates a new branch.

**Request Body:**
```json
{
  "name": "string",
  "address": "string",
  "phone": "string",
  "email": "string"
}
```

**Response:**
```json
{
  "isSuccessful": true,
  "data": "string" // Branch ID
}
```

### Get All Branches

```http
GET /branchs
```

Returns a list of all branches.

**Response:**
```json
{
  "isSuccessful": true,
  "data": [
    {
      "id": "guid",
      "name": "string",
      "address": "string",
      "phone": "string",
      "email": "string"
    }
  ]
}
```

### Get Branch by ID

```http
GET /branchs/{id}
```

Returns details of a specific branch.

**Response:**
```json
{
  "isSuccessful": true,
  "data": {
    "id": "guid",
    "name": "string",
    "address": "string",
    "phone": "string",
    "email": "string"
  }
}
```

### Update Branch

```http
PUT /branchs/{id}
```

Updates an existing branch.

**Request Body:**
```json
{
  "id": "guid",
  "name": "string",
  "address": "string",
  "phone": "string",
  "email": "string"
}
```

**Response:**
```json
{
  "isSuccessful": true,
  "data": "string" // Success message
}
```

### Delete Branch

```http
DELETE /branchs/{id}
```

Deletes a branch.

**Response:**
```json
{
  "isSuccessful": true,
  "data": "string" // Success message
}
```

## Customer Endpoints

### Create Customer

```http
POST /customers
```

Creates a new customer.

**Request Body:**
```json
{
  "name": "string",
  "surname": "string",
  "email": "string",
  "phone": "string",
  "address": "string"
}
```

**Response:**
```json
{
  "isSuccessful": true,
  "data": "string" // Customer ID
}
```

### Get All Customers

```http
GET /customers
```

Returns a list of all customers.

**Response:**
```json
{
  "isSuccessful": true,
  "data": [
    {
      "id": "guid",
      "name": "string",
      "surname": "string",
      "email": "string",
      "phone": "string",
      "address": "string"
    }
  ]
}
```

### Get Customer by ID

```http
GET /customers/{id}
```

Returns details of a specific customer.

**Response:**
```json
{
  "isSuccessful": true,
  "data": {
    "id": "guid",
    "name": "string",
    "surname": "string",
    "email": "string",
    "phone": "string",
    "address": "string"
  }
}
```

### Update Customer

```http
PUT /customers/{id}
```

Updates an existing customer.

**Request Body:**
```json
{
  "id": "guid",
  "name": "string",
  "surname": "string",
  "email": "string",
  "phone": "string",
  "address": "string"
}
```

**Response:**
```json
{
  "isSuccessful": true,
  "data": "string" // Success message
}
```

### Delete Customer

```http
DELETE /customers/{id}
```

Deletes a customer.

**Response:**
```json
{
  "isSuccessful": true,
  "data": "string" // Success message
}
```

## Shipment Endpoints

### Create Shipment

```http
POST /shipments
```

Creates a new shipment.

**Request Body:**
```json
{
  "senderId": "guid",
  "receiverId": "guid",
  "sourceBranchId": "guid",
  "destinationBranchId": "guid",
  "content": "string",
  "weight": "number",
  "dimensions": {
    "length": "number",
    "width": "number",
    "height": "number"
  }
}
```

**Response:**
```json
{
  "isSuccessful": true,
  "data": "string" // Shipment ID
}
```

### Get All Shipments

```http
GET /shipments
```

Returns a list of all shipments.

**Response:**
```json
{
  "isSuccessful": true,
  "data": [
    {
      "id": "guid",
      "senderId": "guid",
      "receiverId": "guid",
      "sourceBranchId": "guid",
      "destinationBranchId": "guid",
      "status": "string",
      "content": "string",
      "weight": "number",
      "dimensions": {
        "length": "number",
        "width": "number",
        "height": "number"
      }
    }
  ]
}
```

### Get Shipment by ID

```http
GET /shipments/{id}
```

Returns details of a specific shipment.

**Response:**
```json
{
  "isSuccessful": true,
  "data": {
    "id": "guid",
    "senderId": "guid",
    "receiverId": "guid",
    "sourceBranchId": "guid",
    "destinationBranchId": "guid",
    "status": "string",
    "content": "string",
    "weight": "number",
    "dimensions": {
      "length": "number",
      "width": "number",
      "height": "number"
    }
  }
}
```

### Update Shipment

```http
PUT /shipments/{id}
```

Updates an existing shipment.

**Request Body:**
```json
{
  "id": "guid",
  "status": "string",
  "content": "string",
  "weight": "number",
  "dimensions": {
    "length": "number",
    "width": "number",
    "height": "number"
  }
}
```

**Response:**
```json
{
  "isSuccessful": true,
  "data": "string" // Success message
}
```

### Delete Shipment

```http
DELETE /shipments/{id}
```

Deletes a shipment.

**Response:**
```json
{
  "isSuccessful": true,
  "data": "string" // Success message
}
```

## Shipment Tracking Endpoints

### Create Shipment Tracking

```http
POST /shipment-trackings
```

Creates a new shipment tracking entry.

**Request Body:**
```json
{
  "shipmentId": "guid",
  "status": "string",
  "location": "string",
  "notes": "string"
}
```

**Response:**
```json
{
  "isSuccessful": true,
  "data": "string" // Tracking ID
}
```

### Get All Shipment Trackings

```http
GET /shipment-trackings
```

Returns a list of all shipment tracking entries.

**Response:**
```json
{
  "isSuccessful": true,
  "data": [
    {
      "id": "guid",
      "shipmentId": "guid",
      "status": "string",
      "location": "string",
      "notes": "string",
      "timestamp": "datetime"
    }
  ]
}
```

### Get Shipment Tracking by ID

```http
GET /shipment-trackings/{id}
```

Returns details of a specific shipment tracking entry.

**Response:**
```json
{
  "isSuccessful": true,
  "data": {
    "id": "guid",
    "shipmentId": "guid",
    "status": "string",
    "location": "string",
    "notes": "string",
    "timestamp": "datetime"
  }
}
```

### Update Shipment Tracking

```http
PUT /shipment-trackings/{id}
```

Updates an existing shipment tracking entry.

**Request Body:**
```json
{
  "id": "guid",
  "status": "string",
  "location": "string",
  "notes": "string"
}
```

**Response:**
```json
{
  "isSuccessful": true,
  "data": "string" // Success message
}
```

### Delete Shipment Tracking

```http
DELETE /shipment-trackings/{id}
```

Deletes a shipment tracking entry.

**Response:**
```json
{
  "isSuccessful": true,
  "data": "string" // Success message
}
```

## Vehicle Endpoints

### Create Vehicle

```http
POST /vehicles
```

Creates a new vehicle.

**Request Body:**
```json
{
  "plateNumber": "string",
  "type": "string",
  "model": "string",
  "capacity": "number",
  "branchId": "guid"
}
```

**Response:**
```json
{
  "isSuccessful": true,
  "data": "string" // Vehicle ID
}
```

### Get All Vehicles

```http
GET /vehicles
```

Returns a list of all vehicles.

**Response:**
```json
{
  "isSuccessful": true,
  "data": [
    {
      "id": "guid",
      "plateNumber": "string",
      "type": "string",
      "model": "string",
      "capacity": "number",
      "branchId": "guid",
      "status": "string"
    }
  ]
}
```

### Get Vehicle by ID

```http
GET /vehicles/{id}
```

Returns details of a specific vehicle.

**Response:**
```json
{
  "isSuccessful": true,
  "data": {
    "id": "guid",
    "plateNumber": "string",
    "type": "string",
    "model": "string",
    "capacity": "number",
    "branchId": "guid",
    "status": "string"
  }
}
```

### Update Vehicle

```http
PUT /vehicles/{id}
```

Updates an existing vehicle.

**Request Body:**
```json
{
  "id": "guid",
  "plateNumber": "string",
  "type": "string",
  "model": "string",
  "capacity": "number",
  "branchId": "guid",
  "status": "string"
}
```

**Response:**
```json
{
  "isSuccessful": true,
  "data": "string" // Success message
}
```

### Delete Vehicle

```http
DELETE /vehicles/{id}
```

Deletes a vehicle.

**Response:**
```json
{
  "isSuccessful": true,
  "data": "string" // Success message
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "isSuccessful": false,
  "error": {
    "message": "string",
    "details": ["string"]
  }
}
```

### 401 Unauthorized

```json
{
  "isSuccessful": false,
  "error": {
    "message": "Authentication failed",
    "details": ["Invalid or expired token"]
  }
}
```

### 404 Not Found

```json
{
  "isSuccessful": false,
  "error": {
    "message": "Resource not found",
    "details": ["The requested resource was not found"]
  }
}
```

### 500 Internal Server Error

```json
{
  "isSuccessful": false,
  "error": {
    "message": "Internal server error",
    "details": ["An unexpected error occurred"]
  }
}
``` 