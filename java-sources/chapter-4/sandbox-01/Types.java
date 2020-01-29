import com.amazonaws.AmazonClientException;
import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.simpleworkflow.AmazonSimpleWorkflow;
import com.amazonaws.services.simpleworkflow.AmazonSimpleWorkflowClientBuilder;
import com.amazonaws.services.simpleworkflow.model.*;

public class Types {

    private static ProfileCredentialsProvider credentials = new ProfileCredentialsProvider("default_admin");
    private static final AmazonSimpleWorkflow simpleWorkflow
            = AmazonSimpleWorkflowClientBuilder.standard().withCredentials(credentials).build() ;

    public final static String DOMAIN = "ExampleDomain";
    public final static String TASKLIST = "ExampleTasklist";
    public final static String WORKFLOW = "ExampleWorkflow";
    public final static String WORKFLOW_VERSION = "1.3";
    public final static String ACTIVITY = "ExampleActivity";
    public final static String ACTIVITY_VERSION = "1.0";

    private static void registerDomain(AmazonSimpleWorkflow swf) {
        try {
            System.out.println("Register the domain '" + DOMAIN + "'.");
            simpleWorkflow.registerDomain(new RegisterDomainRequest()
                    .withName(DOMAIN)
                    .withWorkflowExecutionRetentionPeriodInDays("7"));
        } catch (DomainAlreadyExistsException e) {
            System.out.println("Exception: Domain Already exists!");
        }
    }

    private static void registerActivityType(AmazonSimpleWorkflow swf) {
        try {
            System.out.println("Register Activity Type'" + ACTIVITY +"-" + ACTIVITY_VERSION + "'.");
            simpleWorkflow.registerActivityType(new RegisterActivityTypeRequest().withDomain(DOMAIN)
                    .withName(ACTIVITY)
                    .withDefaultTaskList(new TaskList().withName(TASKLIST))
                    .withVersion(ACTIVITY_VERSION));
        } catch (TypeAlreadyExistsException e) {
            System.out.println("Exception: Activity type already exists!");
        }
    }

    private static void registerWorkflowType(AmazonSimpleWorkflow swf) {
        try {
            System.out.println("Register Workflow Type '" + WORKFLOW +
                    "-" + WORKFLOW_VERSION + "'.");
            swf.registerWorkflowType(new RegisterWorkflowTypeRequest()
                    .withDomain(DOMAIN)
                    .withName(WORKFLOW)
                    .withVersion(WORKFLOW_VERSION)
                    .withDefaultChildPolicy(ChildPolicy.TERMINATE)
                    .withDefaultTaskList(new TaskList().withName(TASKLIST))
                    .withDefaultTaskStartToCloseTimeout("30")
                    .withDefaultExecutionStartToCloseTimeout("30"));
        } catch (TypeAlreadyExistsException e) {
            System.out.println("Exception: Workflow type already exists!");
        }
    }

    public static void main(String[] args) {

        try {
            credentials.getCredentials();
        } catch (Exception e) {
            throw new AmazonClientException("Unable to load Credentials.", e);
        }

        AmazonSimpleWorkflow swf =
                AmazonSimpleWorkflowClientBuilder.standard()
                        .withCredentials(credentials)
                        .withRegion(Regions.US_WEST_2)
                        .build();

        registerDomain(swf);
        registerWorkflowType(swf);
        registerActivityType(swf);
    }
}