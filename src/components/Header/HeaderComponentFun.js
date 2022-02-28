import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, TextField } from '@material-ui/core';
import axios from 'axios';
import { ACTIONS, QUERY_ENDPOINT, COMMON_GREMLIN_ERROR } from '../../constants';
import { onFetchQuery } from '../../logics/actionHelper';
import { optionDataSelector, optionActions, gremlinDataSelector, gremlinActions, graphSelector, graphActions } from '../../slices';

export const HeaderFun = (() => {

  const dispatch = useDispatch();

  const { nodes, edges } = useSelector(graphSelector);
  const { nodeLabels, nodeLimit } = useSelector(optionDataSelector);
  const { host, port, query, error } = useSelector(gremlinDataSelector);

  const onHostChanged = (event) => dispatch(gremlinActions.setHost(event.target.value))

  const onPortChanged = (event) => dispatch(gremlinActions.setPort(event.target.value))

  const onQueryChanged = (event) => dispatch(gremlinActions.setQuery(event.target.value))

  const clearGraph = () => {
    dispatch(graphActions.clearGraph());
  }

  const sendQuery = (e) => {
    onFetchQuery(
      {"data": [
        {
          "id": 28712,
          "label": "attribute",
          "properties": {
            "name": "notation",
            "isSystem": false,
            "physicalType": "NAME",
            "idd": "bc82704a-1b73-4f77-9707-4ec123855d30",
            "uri": "http://www.w3.org/2004/02/skos/core#notation",
            "type": "attribute"
          },
          "edges": []
        },
        {
          "id": 49240,
          "label": "association",
          "properties": {
            "name": "Broader-Narrower concepts",
            "isHierarchical": true,
            "idd": "95d9cd52-efab-4ecb-8deb-802af7fc007c",
            "uri": "http://www.mondeca.com/system/publishing#BT-NT",
            "type": "association"
          },
          "edges": [
            {
              "id": "{\"relationId\":\"2uq3-11zs-2ivp-fxk\"}",
              "from": 49240,
              "to": 20648,
              "label": "role",
              "properties": {
                "name": "broader"
              }
            },
            {
              "id": "{\"relationId\":\"2v4b-11zs-2ivp-11y0\"}",
              "from": 49240,
              "to": 49176,
              "label": "role",
              "properties": {
                "name": "narrower"
              }
            }
          ]
        },
        {
          "id": 32840,
          "label": "class",
          "properties": {
            "name": "Concept",
            "idd": "dcda980d-46f1-4ebe-afb5-9522986aa847",
            "uri": "http://www.w3.org/2004/02/skos/core#Concept",
            "type": "class"
          },
          "edges": [
            {
              "id": "{\"relationId\":\"1v61-pc8-2brp-crk\"}",
              "from": 32840,
              "to": 16544,
              "label": "attributeConstraint",
              "properties": {
                "idd": "b04e6101-01e1-40a7-b7fe-208e5f45aef1",
                "name": "URI",
                "isInherited": false
              }
            },
            {
              "id": "{\"relationId\":\"1tl5-pc8-2brp-crs\"}",
              "from": 32840,
              "to": 16552,
              "label": "attributeConstraint",
              "properties": {
                "idd": "12595395-8721-4251-b88e-edfda803654b",
                "name": "history note",
                "isInherited": false
              }
            },
            {
              "id": "{\"relationId\":\"1udl-pc8-2brp-j4g\"}",
              "from": 32840,
              "to": 24784,
              "label": "attributeConstraint",
              "properties": {
                "idd": "b2bc75f6-f824-44f5-b9a1-42835a61cf3b",
                "name": "alternative label",
                "isInherited": false
              }
            },
            {
              "id": "{\"relationId\":\"1urt-pc8-2brp-m5k\"}",
              "from": 32840,
              "to": 28712,
              "label": "attributeConstraint",
              "properties": {
                "name": "notation",
                "idd": "8558c6ba-5e74-4d3f-b0c5-856a6f4df9c3",
                "isInherited": false
              }
            },
            {
              "id": "{\"relationId\":\"1seh-pc8-2brp-m8w\"}",
              "from": 32840,
              "to": 28832,
              "label": "attributeConstraint",
              "properties": {
                "idd": "fb4d87d4-f33b-4a90-868f-3752ce3d252c",
                "isInherited": false,
                "name": "hidden label"
              }
            },
            {
              "id": "{\"relationId\":\"1t6x-pc8-2brp-paw\"}",
              "from": 32840,
              "to": 32792,
              "label": "attributeConstraint",
              "properties": {
                "name": "definition",
                "isInherited": false,
                "idd": "12b91fc6-2406-4672-bb12-ba9a937617d3"
              }
            },
            {
              "id": "{\"relationId\":\"1tzd-pc8-2brp-sgo\"}",
              "from": 32840,
              "to": 36888,
              "label": "attributeConstraint",
              "properties": {
                "idd": "aede8d13-eb9a-4c8e-a97a-d1be258babef",
                "isInherited": false,
                "name": "is replaced by"
              }
            },
            {
              "id": "{\"relationId\":\"1vk9-pc8-2brp-vo8\"}",
              "from": 32840,
              "to": 41048,
              "label": "attributeConstraint",
              "properties": {
                "isInherited": false,
                "idd": "98a7c20e-9633-4830-b667-ccaccbf52b9b",
                "name": "Name"
              }
            },
            {
              "id": "{\"relationId\":\"1ssp-pc8-2brp-yu0\"}",
              "from": 32840,
              "to": 45144,
              "label": "attributeConstraint",
              "properties": {
                "name": "scope note",
                "idd": "93f49454-01b6-420c-9a05-06b490be8054",
                "isInherited": false
              }
            },
            {
              "id": "{\"relationId\":\"1vyh-pc8-2exh-9m0\"}",
              "from": 32840,
              "to": 12456,
              "label": "superclass",
              "properties": {}
            },
            {
              "id": "{\"relationId\":\"1c7d-pc8-2kgl-m94\"}",
              "from": 32840,
              "to": 28840,
              "label": "associationConstraint",
              "properties": {}
            },
            {
              "id": "{\"relationId\":\"1bt5-pc8-2kgl-vs0\"}",
              "from": 32840,
              "to": 41184,
              "label": "associationConstraint",
              "properties": {}
            }
          ]
        },
        {
          "id": 20648,
          "label": "associationRole",
          "properties": {
            "name": "broader",
            "isHierarchical": true,
            "isIngoing": true,
            "idd": "46a5185a-25b5-4438-b3e5-2c884e97bc55",
            "uri": "http://www.w3.org/2004/02/skos/core#broader",
            "type": "associationRole"
          },
          "edges": []
        },
        {
          "id": 36936,
          "label": "class",
          "properties": {
            "name": "Gender",
            "idd": "3d01b6b2-950b-47b9-a0b8-7cd0a543e0f6",
            "uri": "http://schema.org/GenderType",
            "type": "class"
          },
          "edges": [
            {
              "id": "{\"relationId\":\"1qfd-si0-2brp-crk\"}",
              "from": 36936,
              "to": 16544,
              "label": "attributeConstraint",
              "properties": {
                "isInherited": false,
                "name": "URI",
                "idd": "0eeaa3a3-efe8-44c5-b3db-22510afed01d"
              }
            },
            {
              "id": "{\"relationId\":\"1qtl-si0-2brp-vo8\"}",
              "from": 36936,
              "to": 41048,
              "label": "attributeConstraint",
              "properties": {
                "name": "Name",
                "idd": "eeb8e016-27c7-410f-88e9-67c63b32c070",
                "isInherited": false
              }
            },
            {
              "id": "{\"relationId\":\"1r7t-si0-2exh-18bc\"}",
              "from": 36936,
              "to": 57432,
              "label": "superclass",
              "properties": {}
            }
          ]
        },
        {
          "id": 45144,
          "label": "attribute",
          "properties": {
            "name": "scope note",
            "isSystem": false,
            "physicalType": "NOTE",
            "idd": "8214dab2-5212-4ce0-af31-6f1b32bf8e48",
            "uri": "http://www.w3.org/2004/02/skos/core#scopeNote",
            "type": "attribute"
          },
          "edges": []
        },
        {
          "id": 32792,
          "label": "attribute",
          "properties": {
            "name": "definition",
            "isSystem": false,
            "physicalType": "NOTE",
            "idd": "5aa92c73-a5bd-43a6-89ff-89d4628492a5",
            "uri": "http://www.w3.org/2004/02/skos/core#definition",
            "type": "attribute"
          },
          "edges": []
        },
        {
          "id": 32976,
          "label": "class",
          "properties": {
            "name": "Sports Team",
            "idd": "9edda53d-a6a1-47d4-b445-45c916289ff4",
            "uri": "http://schema.org/SportsTeam",
            "type": "class"
          },
          "edges": [
            {
              "id": "{\"relationId\":\"1st6-pg0-2brp-crk\"}",
              "from": 32976,
              "to": 16544,
              "label": "attributeConstraint",
              "properties": {
                "idd": "b6538f33-0d5a-40df-87f5-efea8b180c30",
                "name": "URI",
                "isInherited": false
              }
            },
            {
              "id": "{\"relationId\":\"1vyy-pg0-2brp-fyo\"}",
              "from": 32976,
              "to": 20688,
              "label": "attributeConstraint",
              "properties": {
                "isInherited": true,
                "name": "number of employees",
                "idd": "4c60af98-6439-4126-bf5c-d5926e73f8fb"
              }
            },
            {
              "id": "{\"relationId\":\"1wd6-pg0-2brp-j3k\"}",
              "from": 32976,
              "to": 24752,
              "label": "attributeConstraint",
              "properties": {
                "idd": "1e710331-5a4c-4c8f-bc71-e8bdb0aca1b9",
                "name": "DBpedia URI",
                "isInherited": true
              }
            },
            {
              "id": "{\"relationId\":\"1tzu-pg0-2brp-mao\"}",
              "from": 32976,
              "to": 28896,
              "label": "attributeConstraint",
              "properties": {
                "idd": "d3f084d6-ec9e-4531-ba25-7ed458c3917e",
                "isInherited": true,
                "name": "founding date"
              }
            },
            {
              "id": "{\"relationId\":\"1sey-pg0-2brp-pew\"}",
              "from": 32976,
              "to": 32936,
              "label": "attributeConstraint",
              "properties": {
                "name": "gender",
                "isInherited": false,
                "maxCardinality": 1,
                "idd": "09ace9c3-4b38-4a3a-870c-1098fcf46238"
              }
            },
            {
              "id": "{\"relationId\":\"1t7e-pg0-2brp-vo8\"}",
              "from": 32976,
              "to": 41048,
              "label": "attributeConstraint",
              "properties": {
                "name": "Name",
                "idd": "edba1ce5-be6a-4103-894e-b27fc65878ec",
                "isInherited": false
              }
            },
            {
              "id": "{\"relationId\":\"1tlm-pg0-2brp-vqo\"}",
              "from": 32976,
              "to": 41136,
              "label": "attributeConstraint",
              "properties": {
                "idd": "2e003a5d-1cbc-4b8b-b871-23820b30cf56",
                "name": "sport",
                "isInherited": true
              }
            },
            {
              "id": "{\"relationId\":\"1zx6-pg0-2exh-skw\"}",
              "from": 32976,
              "to": 37040,
              "label": "superclass",
              "properties": {}
            }
          ]
        },
        {
          "id": 37024,
          "label": "class",
          "properties": {
            "name": "Data item pointer",
            "idd": "cf2923f5-bd31-40d9-8a9f-f4f9c42faeb3",
            "uri": "http://www.mondeca.com/system/basicontology#Data_Item_Pointer",
            "type": "class"
          },
          "edges": [
            {
              "id": "{\"relationId\":\"2kgk-skg-2brp-crk\"}",
              "from": 37024,
              "to": 16544,
              "label": "attributeConstraint",
              "properties": {
                "idd": "d5f2be04-4911-4f50-8a91-b2782393f88f",
                "name": "URI",
                "isInherited": false
              }
            },
            {
              "id": "{\"relationId\":\"2kus-skg-2brp-vo8\"}",
              "from": 37024,
              "to": 41048,
              "label": "attributeConstraint",
              "properties": {
                "name": "Name",
                "idd": "77212020-a048-4cb7-b15a-2e55fb3c22cb",
                "isInherited": false
              }
            },
            {
              "id": "{\"relationId\":\"2r6c-skg-2exh-fxc\"}",
              "from": 37024,
              "to": 20640,
              "label": "superclass",
              "properties": {}
            }
          ]
        },
        {
          "id": 32992,
          "label": "class",
          "properties": {
            "name": "IPTC Media Topic",
            "idd": "7c8158e2-0d38-49e6-b0f8-e7f8b13a05db",
            "uri": "http://www.mondeca.com/demo/model#IPTC_MediaTopic",
            "type": "class"
          },
          "edges": [
            {
              "id": "{\"relationId\":\"5iqk-pgg-2brp-crk\"}",
              "from": 32992,
              "to": 16544,
              "label": "attributeConstraint",
              "properties": {
                "idd": "899c2948-a5bb-4165-a890-aa37cf0e6ced",
                "name": "URI",
                "isInherited": false
              }
            },
            {
              "id": "{\"relationId\":\"5li4-pgg-2brp-crs\"}",
              "from": 32992,
              "to": 16552,
              "label": "attributeConstraint",
              "properties": {
                "idd": "6dc74ade-0f93-44fd-8c64-82c662732ff5",
                "isInherited": true,
                "name": "history note"
              }
            },
            {
              "id": "{\"relationId\":\"5jx8-pgg-2brp-izs\"}",
              "from": 32992,
              "to": 24616,
              "label": "attributeConstraint",
              "properties": {
                "isInherited": true,
                "idd": "f269b364-296d-4a53-8c65-91e9e8328a2a",
                "name": "created"
              }
            },
            {
              "id": "{\"relationId\":\"5jj0-pgg-2brp-j34\"}",
              "from": 32992,
              "to": 24736,
              "label": "attributeConstraint",
              "properties": {
                "idd": "5b42f532-e436-49b5-9918-884df37aae9e",
                "name": "modified",
                "isInherited": true
              }
            },
            {
              "id": "{\"relationId\":\"5mak-pgg-2brp-j4g\"}",
              "from": 32992,
              "to": 24784,
              "label": "attributeConstraint",
              "properties": {
                "idd": "0ac3508d-aec9-4829-9e37-a0f95006c02f",
                "name": "alternative label",
                "isInherited": true
              }
            },
            {
              "id": "{\"relationId\":\"5mos-pgg-2brp-m5k\"}",
              "from": 32992,
              "to": 28712,
              "label": "attributeConstraint",
              "properties": {
                "isInherited": true,
                "idd": "db601a8d-ad44-4e03-8e6f-2a1508fd9863",
                "name": "notation"
              }
            },
            {
              "id": "{\"relationId\":\"5kbg-pgg-2brp-m8w\"}",
              "from": 32992,
              "to": 28832,
              "label": "attributeConstraint",
              "properties": {
                "idd": "284797cd-81d2-47ed-a634-53f151c60e54",
                "name": "hidden label",
                "isInherited": true
              }
            },
            {
              "id": "{\"relationId\":\"5l3w-pgg-2brp-paw\"}",
              "from": 32992,
              "to": 32792,
              "label": "attributeConstraint",
              "properties": {
                "idd": "eb0ac8ae-26f5-42de-af8a-d78fb11e3f1e",
                "name": "definition",
                "isInherited": true
              }
            },
            {
              "id": "{\"relationId\":\"5lwc-pgg-2brp-sgo\"}",
              "from": 32992,
              "to": 36888,
              "label": "attributeConstraint",
              "properties": {
                "name": "is replaced by",
                "isInherited": true,
                "idd": "4ddd5e55-e1a1-44bb-9c76-3007f65f3ee3"
              }
            },
            {
              "id": "{\"relationId\":\"5j4s-pgg-2brp-vo8\"}",
              "from": 32992,
              "to": 41048,
              "label": "attributeConstraint",
              "properties": {
                "isInherited": false,
                "idd": "488600c0-a2b5-4972-816f-7ddc80363cb7",
                "name": "Name"
              }
            },
            {
              "id": "{\"relationId\":\"5kpo-pgg-2brp-yu0\"}",
              "from": 32992,
              "to": 45144,
              "label": "attributeConstraint",
              "properties": {
                "name": "scope note",
                "idd": "1b47d473-8b42-45b2-a272-791f981e10c2",
                "isInherited": true
              }
            },
            {
              "id": "{\"relationId\":\"5yxo-pgg-2exh-sm8\"}",
              "from": 32992,
              "to": 37088,
              "label": "superclass",
              "properties": {}
            },
            {
              "id": "{\"relationId\":\"5n30-pgg-2kgl-ys8\"}",
              "from": 32992,
              "to": 45080,
              "label": "associationConstraint",
              "properties": {}
            },
            {
              "id": "{\"relationId\":\"5nh8-pgg-2kgl-155k\"}",
              "from": 32992,
              "to": 53336,
              "label": "associationConstraint",
              "properties": {}
            }
          ]
        }
      ]}, query, nodeLabels, dispatch)
    // dispatch(gremlinActions.setError(null))
    // onFetchQuery({}, query, nodeLabels, dispatch)
    // axios.post(
    //   QUERY_ENDPOINT,
    //   { host: host, port: port, query: query, nodeLimit: nodeLimit },
    //   { headers: { 'Content-Type': 'application/json' } })
    //   .then((response) => onFetchQuery(response, query, nodeLabels, dispatch))
    //   .catch((error) => dispatch(gremlinActions.setError(COMMON_GREMLIN_ERROR)))
  }

  return (
    <div className={'header'}>
      <form noValidate autoComplete="off">
        <TextField value={host} onChange={onHostChanged} id="standard-basic" label="host" style={{ width: '10%' }} />
        <TextField value={port} onChange={onPortChanged} id="standard-basic" label="port" style={{ width: '10%' }} />
        <TextField value={query} onChange={onQueryChanged} id="standard-basic" label="gremlin query" style={{ width: '60%' }} />
        <Button variant="contained" color="primary" onClick={sendQuery} style={{ width: '150px' }} >Execute</Button>
        <Button variant="outlined" color="secondary" onClick={clearGraph} style={{ width: '150px' }} >Clear Graph</Button>
      </form>
      <br />
      <div style={{ color: 'red' }}>{error}</div>
    </div>
  )
})