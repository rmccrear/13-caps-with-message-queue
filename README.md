
List of events:

            "request-pickup": Sent from Vendor to Hub
            "request-pickup-to-driver": Sent from Hub to Driver
            "driver-accept-pickup": Sent from Driver to Hub
            "driver-reject-pickup": Return to Item to Queue
            "pickup-accepted": Sent from Hub to Drivers and Client to notify them (out for "delivery")

            "delivery-complete": From Driver to Hub
            "delivered": Sent from Hub to Vendor to notify

Flow chart of events. Each pickup request startes a 6 step process.

```mermaid
    graph TB
        HUB-->LOG[Global Logger]
        V1[Vendor]--1 <br> pickup<br> requested-->HUB[Hub]
        HUB--2 <br> request pickup<br> to driver-->D1[Driver]
        D1--3 <br> driver <br> accept/reject <br> pickup-->HUB
        HUB--4 <br> pickup<br>accepted-->V1
        D1--5 <br> delivery <br> complete-->HUB
        HUB--6 <br> delivered-->V1

```

The messages passed at each step are as follows:

    1 pickup requested
        Item (includes Vendor)
    2 request pickup to driver
        Item
        Driver
    3 driver accept pickup
        Item
        Driver
    3.5 driver reject pickup
        Item
        Driver
    4 pickup accepted
        Item
        Driver
    5 delivery complete
        Item
        Driver
    6 delivered
        Item

Summary of objects:

Here are JSON objects that get passed by the messaging system. In (parenthesis) are helper function attached to the object when on the client.

Vendor:

    Vendor:
        id: String
        name: String
        (relay:)

Driver:

    Driver:
        id: String
        name: String
        (relay:)

Item:

    Item:
        id: String
        contents: String (description)
        vendor: Object (Vendor Object)

    
