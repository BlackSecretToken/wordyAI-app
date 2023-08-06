from enum import Enum
 
class Gender(Enum):
    Mr = 1
    Mrs = 2
    Company = 3
    NONE = 4

class Role(Enum):
    User = 1
    Admin = 2
    Test = 3

class Category(Enum):
    CSV = 1
    XML = 2
    SHOP = 3

class ESHOPTYPE(Enum):
    WOOCOMMERCE = 1
    MAGENTO2 = 2
    SHOPWARE6 = 3
    SHOPIFY = 4

class PRODUCTSTATUS(Enum):
    OPTIMIZED = 1
    UNOPTIMIZED = 2
    REJECTED = 3
    
class HELPAUDIENCE(Enum):
    DISLIKE = 0
    LIKE = 1

class BILLINGMETHOD(Enum):
    FREE = 0
    MEMBERSHIP = 1

class BILLINGSTATUS(Enum):
    CREATE = 0
    UPDATE = 1
    DELETE = 2

SHOP_DATATYPE = ['', 'CSV', 'XML', 'SHOP']
SHOP_ESHOPTYPE = ['', 'WOOCOMMERCE', 'MAGENTO2', 'SHOPWARE6', 'SHOPIFY']

Role_User = 'User'
Role_Admin = 'Admin'
ProductStatus_Optimized = 'OPTIMIZED'
ProductStatus_Unoptimized = 'UNOPTIMIZED'
ProductStatus_Rejected = 'REJECTED'

Subscription_Active = 'active'
Subscription_Past_due = 'past_due'
Subscription_Unpaid = 'unpaid'
Subscription_Canceled = 'canceled'
Subscription_Incomplete = 'incomplete'
Subscription_Incomplete_expired = 'incomplete_expired'
Subscription_Trialing = 'trialing'
Subscription_Pased = 'pased'
Subscription_All = 'all'
Subscription_Ended = 'ended'

ACTIVATE = 1
DEACTIVATE = 0